import { Request } from "express";

interface StrictDecoded {
    idx: number;
}
interface StrictRequest extends Request {
    decoded: StrictDecoded;
}

export default StrictRequest;
