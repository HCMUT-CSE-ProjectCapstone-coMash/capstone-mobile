import { CreateProduct, RNFile } from "@/types/Product";
import { EncodingType, readAsStringAsync } from "expo-file-system/legacy";
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

export async function EmployeeCreateProduct(productData: CreateProduct, productsOrderId: string) {
    const formData = new FormData();

    formData.append("ProductName", productData.productName);
    formData.append("Category", productData.category);
    formData.append("Color", productData.color);
    formData.append("Pattern", productData.pattern);
    formData.append("SizeType", productData.sizeType);
    formData.append("CreatedBy", productData.createdBy);
    
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
        "/product/create/" + productsOrderId,
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

export async function SearchSimilarProduct(imageFile: RNFile) {
    const base64Image = await readAsStringAsync(imageFile.uri, {
        encoding: EncodingType.Base64,
    });

    const response = await axiosClient.post(
        "/product/fetch-similar",
        { ImageBase64: base64Image },
    );

    return response.data;
}

export async function AnalyzeImage(imageFile: RNFile) {
    const base64Image = await readAsStringAsync(imageFile.uri, {
        encoding: EncodingType.Base64,
    });

    const response = await axiosClient.post(
        "/product/analyze",
        { ImageBase64: base64Image },
    );

    return response.data;
}