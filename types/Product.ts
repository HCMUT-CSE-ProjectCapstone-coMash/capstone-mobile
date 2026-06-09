export interface ProductQuantity {
    size: string;
    quantities: number
}

export interface ProductQuantityChange {
    size: string;
    oldQuantity: number;
    newQuantity: number;
}

export interface Product {
    id: string,
    productId: string,
    productName: string,
    category: string,
    color: string,
    pattern: string,
    sizeType: "Letter" | "Number",
    quantities: ProductQuantity[],
    createdBy: string,
    createdAt: string,
    status: "Pending" | "Approved",
    imageURL: string
    quantityChanges?: ProductQuantityChange[],
    importPrice: number,
    salePrice: number,
}

export interface RNFile {
    uri: string;
    name: string;
    type: string;
}

export interface CreateProduct {
    productName: string,
    categoryId: string,
    colorId: string,
    patternId: string,
    sizeType: "Letter" | "Number",
    quantities: ProductQuantity[],
    createdBy: string,
    image: RNFile,
    importPrice: number,
    salePrice: number,
}

export interface UpdateProduct {
    productId?: string,
    productName?: string,
    categoryId?: string,
    colorId?: string,
    patternId?: string,
    sizeType?: "Letter" | "Number",
    quantities?: ProductQuantity[],
    image?: File | null,
    importPrice?: number,
    salePrice?: number,
}

export interface ProductWithOrderStatus {
    id: string,
    productId: string
    productName: string,
    category: string,
    color: string,
    pattern: string,
    sizeType: "Letter" | "Number",
    quantities: ProductQuantity[],
    createdBy: string,
    createdAt: string,
    status: "Pending" | "Approved",
    imageURL: string
    quantityChanges?: ProductQuantityChange[],
    importPrice: number,
    salePrice: number,
    isInPendingOrder: boolean
};

export type Category = {
    id: string,
    categoryName: string,
};

export type Color = {
    id: string,
    colorName: string,
};

export type Pattern = {
    id: string,
    patternName: string,
}