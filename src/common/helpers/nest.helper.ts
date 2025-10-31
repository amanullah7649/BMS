import mongoose from "mongoose";

export class NestHelper {
    private static instance: NestHelper;

    static getInstance(): NestHelper {
        NestHelper.instance = NestHelper.instance || new NestHelper();
        return NestHelper.instance;
    }

    isMongoId(id: any): boolean {
        return mongoose.Types.ObjectId.isValid(id);
    }

    getObjectId(id: any): mongoose.Types.ObjectId {
        if (!this.isMongoId(id)) {

            return new mongoose.Types.ObjectId(id);
        }
        return id;
    }

    sortItems<T>(items: T[], key: keyof T): T[] {
        return items.sort((a, b) => {
            const valueA = a[key];
            const valueB = b[key];
            return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
        });
    }

    findCommonElements(arr1: any[], arr2: any[]): any[] {
        const set2 = new Set(arr2);
        return arr1.filter((value) => set2.has(value));
    }

    async asyncForEach<T>(array: Array<T>, callback: (item: T, index: number, array: Array<T>) => void): Promise<void> {
        for (let index = 0; index < array.length; index++) {
            // eslint-disable-next-line
            await callback(array[index], index, array);
        }
    }

    findObjectByField<T extends Record<string, any>>(arr: T[], field: keyof T, value: T[keyof T]): T | undefined {
        return arr.find((obj) => obj[field] === value);
    }

    isEmpty<T>(value: string | number | boolean | object | Array<T>): boolean {
        return (
            // null or undefined
            value == null ||
            value == undefined ||
            value == '' ||
            value == 0 ||
            value == false ||
            (typeof value == 'string' && value?.trim() == '') ||
            // has length and it's zero
            (value.hasOwnProperty('length') && (value as Array<T>).length === 0) ||
            // is an Object and has no keys
            (value.constructor === Object && Object.keys(value).length === 0)
        );
    }

    arrayFirstOrNull<T>(arr: Array<T>): T | null {
        if (arr.hasOwnProperty('length') && arr.length > 0) {
            return arr[0];
        } else {
            return null;
        }
    }

    getUnmatchedElements(oldArr: string[], newArr: string[]): string[] {
        let difference = oldArr.filter((x) => !newArr.includes(x));
        return difference;
    }
    capitalizeFirstLetter(name: string): string {
        return name.charAt(0).toUpperCase() + name.slice(1);
    }
    getBooleanValue(input: string | boolean): boolean {
        if (typeof input === 'boolean') {
            return input;
        } else if (typeof input === 'string') {
            let lowerCaseInput = input.toLowerCase();
            if (lowerCaseInput === 'true') {
                return true;
            } else if (lowerCaseInput === 'false') {
                return false;
            }
        }
        return false;
    }
    areArraysEqual<T>(arr1: Array<T>, arr2: Array<T>): boolean {
        // Both arrays are null or undefined
        if (arr1 == null && arr2 == null) return true;

        // One array is null or undefined, but the other is not
        if (arr1 == null || arr2 == null) return false;

        // Arrays have different lengths
        if (arr1.length !== arr2.length) return false;

        // Sort and compare each element
        const sortedArr1 = arr1.slice().sort();
        const sortedArr2 = arr2.slice().sort();

        for (let i = 0; i < sortedArr1.length; i++) {
            if (sortedArr1[i] !== sortedArr2[i]) {
                return false;
            }
        }

        return true;
    }

}