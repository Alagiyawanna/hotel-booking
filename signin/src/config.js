const config = {
    API_URL: process.env.NODE_ENV === 'production' 
      ? 'http://23.21.176.140:5000'
      : 'http://localhost:5000'
  };
  
  export default config;