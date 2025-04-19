import React from "react";
import { unstable_BlockerFunction as BlockerFunction } from "react-router-dom";
import useConfirm from "./hooks/use-confirm";
import usePrompt from "./hooks/use-prompt";
type ReactRouterPromptProps = {
    when: boolean | BlockerFunction;
    children: (data: {
        isActive: boolean;
        onCancel(): void;
        onConfirm(): void;
    }) => React.ReactNode;
    beforeCancel?: () => Promise<unknown>;
    beforeConfirm?: () => Promise<unknown>;
};
/**
 * A replacement component for the react-router `Prompt`.
 * Allows for more flexible dialogs.
 *
 * @example
 * <ReactRouterPrompt when={isDirty}>
 *   {({isActive, onConfirm, onCancel}) => (
 *     <Modal show={isActive}>
 *       <div>
 *         <p>Do you really want to leave?</p>
 *         <button onClick={onCancel}>Cancel</button>
 *         <button onClick={onConfirm}>Ok</button>
 *       </div>
 *     </Modal>
 *   )}
 * </ReactRouterPrompt>
 */
declare function ReactRouterPrompt({ when, children, beforeCancel, beforeConfirm, }: ReactRouterPromptProps): JSX.Element | null;
export default ReactRouterPrompt;
export { useConfirm, usePrompt };
