namespace TypeInference {
    // 型推論のサンプル
    let a = 1 + 2; // number
    let b = a + 3; // number
    let c = {
        apple: a,
        banana: b,
    }; // { apple: number, banana: number }
    let d = c.apple * 4; // number
}
