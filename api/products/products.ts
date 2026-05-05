import { CreateProduct } from "@/types/Product";
import { axiosClient } from "../axiosClient";

export async function FetchApprovedProductByName(productName: string) {
    const response = await axiosClient.get(
        "/product/fetch-by-name/" + productName,
    );

    return response.data;
}

export async function CreateProductIdByCategory(category: string) {
    const response = await axiosClient.get(
        "/product/create-product-id-by-category/" + category,
    );

    return response.data;
}

export async function OwnerCreateProduct(productData: CreateProduct) {
    const formData = new FormData();

    formData.append("ProductName", productData.productName);
    formData.append("Category", productData.category);
    formData.append("Color", productData.color);
    formData.append("Pattern", productData.pattern);
    formData.append("SizeType", productData.sizeType);
    formData.append("CreatedBy", productData.createdBy);
    formData.append("ImportPrice", productData.importPrice.toString());
    formData.append("SalePrice", productData.salePrice.toString());

    productData.quantities.forEach((quantity, index) => {
        formData.append(`Quantities[${index}].Size`, quantity.size);
        formData.append(`Quantities[${index}].Quantities`, quantity.quantities.toString());
    })

    formData.append("Image", {
        uri: productData.image.uri,
        name: productData.image.name,
        type: productData.image.type,
    } as any);

    const response = await axiosClient.post(
        "/product/owner-create",
        formData,
        { 
            withCredentials: true,
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );

    return response.data;
}