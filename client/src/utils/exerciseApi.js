export const exerciseOptions = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
      'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY
    },
  };
  
  export const fetchData = async (url, options) => {
    try {
      console.log('Fetching from URL:', url);  // Log the URL
      console.log('Options:', options);  // Log the request options
      
      const res = await fetch(url, options);
      
      // Log the status code and the entire response object
      console.log('Response Status:', res.status);
      console.log('Raw Response:', res);
      
      // Check if response is OK
      if (!res.ok) {
        throw new Error(`Error: ${res.status} - ${res.statusText}`);
      }
      
      // Read text response
      const text = await res.text();
      console.log('Response Text:', text);  // Log raw text response
      
      if (!text) {
        throw new Error("Empty response from the server.");
      }
      
      // Attempt to parse the JSON
      const data = JSON.parse(text);
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  };
  