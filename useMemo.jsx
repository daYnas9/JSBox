/*
    This component demonstrates the use case of useMeo hook.
    In line [22] we are trying to find an item in large array(quite expensive operation, right?)
    Now think whenever count changes the component will re-render and this operation re-run
    which will cause performance issues.
    In such cases useMemo is useful hook to use. It will cache the result of the calculation and 
    will only re-run the calc when dependency params changes.
*/

import { useMemo, useState } from "react"

function initialItems() {
    return new Array(29_999_999).fill(0).map((_, i) => ({
        id: i,
        isSelected: i === 29_999_998
    }))
}

export function MemoComponent() {
    
    const [count, setCount] = useState(0);
    const [items] = useState(initialItems);

    const selectedItem = useMemo(() => items.find((item) => item.isSelected), [items]); 

    return(
        <>
            <h1>Count : {count}</h1>
            <h1>Selected Item : {selectedItem.id}</h1>
            <button onClick={() => setCount(count + 1)}>Increment</button>
        </>
    )
}