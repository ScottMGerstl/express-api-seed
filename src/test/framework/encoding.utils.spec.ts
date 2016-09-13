import { expect } from 'chai';
import { EncodingUtils } from '../../framework/utils/encoding.utils';

let readableString: string = 'hello, world';
let encodedString: string = 'ImhlbGxvLCB3b3JsZCI=';

describe('EncodingUtils', function () {
    describe('base64Encode', function () {
        it('should encode to a base 64 string', function () {
            let sut: string = EncodingUtils.base64Encode(readableString);
            expect(sut).to.equal(encodedString);
        });
    });

    describe('base64Decode', function () {
        it('should decode to a readable string', function () {
            let sut: string = EncodingUtils.base64Decode<string>(encodedString);
            expect(sut).to.equal(readableString);
        });
    });
});