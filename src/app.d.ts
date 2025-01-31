// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			user: {
				id: string;
				name: string;
				role: string;
			} | null;
		}

		interface PageData {
			product?: ProductData;
		}
	}
}

export {};
// export interface ProductData {
// 	id: string;
// 	name: string;
// 	price: number;
// 	image: string;
// 	type: string;
// 	gender?: string;
// 	color?: string;
// 	brand?: string;
// 	sale?: number;
// }