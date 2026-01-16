// Configuración de despliegue
export const deployConfig = {
  // GitHub
  github: {
    owner: process.env.GITHUB_OWNER || 'tu-usuario',
    repo: process.env.GITHUB_REPO || 'sistema-residuos',
    branch: process.env.GITHUB_BRANCH || 'main'
  },
  
  // Render
  render: {
    serviceId: process.env.RENDER_SERVICE_ID,
    apiKey: process.env.RENDER_API_KEY
  },
  
  // Base de datos
  database: {
    url: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production'
  }
};

export default deployConfig;