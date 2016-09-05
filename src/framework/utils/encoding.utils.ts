export class EncodingUtils {

    /**
     * encodes an object into a base64 string
     *
     * @static
     * @template T type to encode
     * @param {T} obj object to encode of type T
     * @returns {string} the base64 encoded string
     */
    public static base64Encode<T>(obj: T): string {
        let base64Value: string = new Buffer(JSON.stringify(obj)).toString('base64');
        return base64Value;
    }

    /**
     * decodes a base64 encoded string into an object of a specified type
     *
     * @static
     * @template T type to return
     * @param {string} value string to decode
     * @returns {T}
     */
    public static base64Decode<T>(value: string): T {
        let result: string = new Buffer(value, 'base64').toString('utf8');
        return <T>JSON.parse(result);
    }
}