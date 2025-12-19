import { useEffect } from "react";


useEffect(()=>{
    const fetchData = async () => {
        try {
            const response = await fetch('https://localhost:7192/api/products');
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    fetchData();
})

