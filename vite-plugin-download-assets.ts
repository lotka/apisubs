// vite-plugin-download-assets.ts
export default function downloadAssetsPlugin() {
  return {
    name: 'download-assets-plugin',
    async config() {
      const { exec } = await import('child_process');
      const { promisify } = await import('util');
      const execAsync = promisify(exec);

      console.log('Running download-assets.cjs before Vite starts...');
      try {
        await execAsync('node download-assets.cjs');
        console.log('Assets downloaded successfully.');
      } catch (error) {
        console.error('Failed to download assets:', error);
        throw error; // stop Vite if download fails
      }
    }
  };
}
