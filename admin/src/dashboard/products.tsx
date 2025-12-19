import { useEffect, useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"




const products = () => { 

    const [products, setProducts] = useState<any[]>([]);

    useEffect(()=>{
        const fetchData = async () => {
            try {
                const response = await fetch('https://localhost:7192/api/products');
                const data = await response.json();
                console.log(data);
                setProducts(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    },[]) 

  return (
    <div className="flex justify-center items-center gap-2">
        {products && products.map((product: any) => (
            <Card key={product.id} className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>{product.name}</CardTitle>
                <CardDescription>Price: ${product.price}</CardDescription>
                {/* <CardAction>Card Action</CardAction> */}
            </CardHeader>
            {/* <CardContent>
                <p>Card Content</p>
            </CardContent>
            <CardFooter>
                <p>Card Footer</p>
            </CardFooter> */}
            </Card>
        ))}
    </div>
  )
}

export default products