/// <reference types="react" />
declare const useLatest: <T>(value: T) => import("react").MutableRefObject<T>;
export default useLatest;
