export const exerciseOptions = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
      'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY
    },
  };
  
  export const fetchData = async (url, options) => {
    try { 
      const res = await fetch(url, options);
      
      if (!res.ok) {
        throw new Error(`Error: ${res.status} - ${res.statusText}`);
      }
      
      const text = await res.text();
      
      if (!text) {
        throw new Error("Empty response from the server.");
      }
      
      const data = JSON.parse(text);
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  };
  