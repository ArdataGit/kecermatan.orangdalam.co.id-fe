import { unstable_BlockerFunction as BlockerFunction } from "react-router-dom";
declare interface InitialStateType {
    isActive: boolean;
    onConfirm(): void;
    resetConfirmation(): void;
}
declare const useConfirm: (when: boolean | BlockerFunction) => InitialStateType;
export default useConfirm;
