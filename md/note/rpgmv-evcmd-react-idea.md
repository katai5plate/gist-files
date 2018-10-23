# Component-oriented thought method
```jsx
(<Command>
    <Window
        faceImage=""
        facePosition={[0, 0]}
        background={0}
        position={-1}
    >
        <Message source="one line of sentences" />
        <Message source="one line of sentences" />
        <Message source="one line of sentences" />
        <Message source="one line of sentences" />
        <Message source="one line of sentences" />
    </Window>
    <Choice
        choices={["A", "B"]}
        cancel={false}
        default={false}
        position={-1}
        background={0}
    >
        <Select id={0} name="A">
            <Any />
            <Any />
        </Select>
        <Select id={1} name="B">
            <Any />
            <Any />
        </Select>
    </Choice>
</Command>)
```
