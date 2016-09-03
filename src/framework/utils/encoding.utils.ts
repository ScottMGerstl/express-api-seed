export class EncodingUtils {
    public static base64Encode<T>(obj: T): string {
        let base64Value: string = new Buffer(JSON.stringify(obj)).toString('base64');
        return base64Value;
    }

    public static base64Decode<T>(value: string): T {
        let result: string = new Buffer(value, 'base64').toString('utf8');
        return <T>JSON.parse(result);
    }
}