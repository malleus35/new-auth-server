import { Request } from "express";

interface StrictDecoded {
    user_idx: number;
}
interface StrictRequest extends Request {
    decoded: StrictDecoded;
}

export default StrictRequest;
