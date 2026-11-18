import { cp, lstat, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, join, relative, resolve, sep } from 'node:path';
import { build, context, version } from 'esbuild';

const mode = process.argv[2];
const development = mode === 'dev';
const basePath = (process.env.VITE_BASE_PATH || '/').replace(/\/+$/, '') + '/';
const dist = resolve('dist');

const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
if (version !== manifest.devDependencies.esbuild) {
  throw new Error('The local esbuild version is out of date. Run npm ci --ignore-scripts.');
}

if (!/^\/(?:[\w-][\w.-]*\/)*$/.test(basePath)) {
  throw new Error('VITE_BASE_PATH must be an absolute URL path, such as / or /omakase/.');
}

function bundleOptions(outdir) {
  return {
    entryPoints: { site: 'src/main.jsx' },
    outdir,
    bundle: true,
    format: 'esm',
    jsx: 'automatic',
    minify: !development,
    sourcemap: development,
    metafile: true,
    entryNames: development ? 'assets/[name]' : 'assets/[name]-[hash]',
    assetNames: 'assets/[name]-[hash]',
    publicPath: basePath,
    loader: {
      '.gif': 'file',
      '.ico': 'file',
      '.jpg': 'file',
      '.pdf': 'file',
      '.png': 'file',
      '.svg': 'file',
      '.webp': 'file'
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(development ? 'development' : 'production'),
      'import.meta.env.BASE_URL': JSON.stringify(basePath),
      'import.meta.env.VITE_CARTO_BASEMAP_KEY': JSON.stringify(process.env.VITE_CARTO_BASEMAP_KEY ?? '')
    }
  };
}

function copyPublicFiles(outdir) {
  return cp('public', outdir, {
    recursive: true,
    async filter(source) {
      if (basename(source).startsWith('.') && source !== join('public', '.nojekyll')) return false;
      if ((await lstat(source)).isSymbolicLink()) {
        throw new Error(`Symbolic links are unsupported in the public directory: ${source}`);
      }
      return true;
    }
  });
}

async function writePages(outdir, scriptUrl, styleUrl) {
  const template = await readFile('index.html', 'utf8');
  const html = template
    .replaceAll('{{base}}', basePath)
    .replace('<!-- site stylesheet -->', `<link rel="stylesheet" href="${styleUrl}" />`)
    .replace('<!-- site scripts -->', [
      `<script type="module" src="${scriptUrl}"></script>`,
      ...(development ? [`<script type="module" src="${basePath}dev-reload.js"></script>`] : [])
    ].join('\n    '));
  await Promise.all([
    writeFile(join(outdir, 'index.html'), html),
    writeFile(join(outdir, '404.html'), html)
  ]);
}

async function buildSite() {
  // Keep the previous output if bundling fails.
  const result = await build({ ...bundleOptions(dist), write: false });
  const [scriptPath, entry] = Object.entries(result.metafile.outputs)
    .find(([, output]) => output.entryPoint === 'src/main.jsx');
  const publicUrl = (file) => basePath + relative(dist, file).split(sep).join('/');

  await rm(dist, { recursive: true, force: true });
  await copyPublicFiles(dist);
  await mkdir(join(dist, 'assets'), { recursive: true });
  await Promise.all(result.outputFiles.map((file) => writeFile(file.path, file.contents)));
  await writePages(dist, publicUrl(scriptPath), publicUrl(entry.cssBundle));
}

async function serveSite() {
  const temporary = development || basePath !== '/';
  const root = temporary ? await mkdtemp(join(tmpdir(), 'omakase-site-')) : dist;
  const outdir = join(root, basePath);
  const server = await context(development ? bundleOptions(outdir) : { write: false });

  async function close() {
    await server.dispose();
    if (temporary) await rm(root, { recursive: true, force: true });
  }

  try {
    if (development) {
      await copyPublicFiles(outdir);
      await writePages(outdir, `${basePath}assets/site.js`, `${basePath}assets/site.css`);
      await writeFile(join(outdir, 'dev-reload.js'),
        "new EventSource('/esbuild').addEventListener('change', () => location.reload());\n");
      await server.watch();
    } else if (temporary) {
      await cp(dist, outdir, { recursive: true });
    }

    const host = '127.0.0.1';
    const { port } = await server.serve({
      host,
      port: development ? 5173 : 4173,
      servedir: root,
      fallback: join(outdir, '404.html')
    });
    console.log(`Omakase is available at http://${host}:${port}${basePath}`);
    process.once('SIGINT', close);
    process.once('SIGTERM', close);
  } catch (error) {
    await close();
    throw error;
  }
}

if (mode === 'build') {
  await buildSite();
} else if (development || mode === 'preview') {
  await serveSite();
} else {
  throw new Error('Expected build, dev, or preview.');
}
