namespace TypeSafety {
    // 型安全性のサンプル
    // エラー。
    // 演算子"+"を3とnever[]に適用できない。
    // 3 + [];

    let obj = {};
    // エラー。
    // objにfooは存在しない。
    // obj.foo;

    function a(b: number) {
        return b / 2;
    }

    // エラー。
    // 引数をnumber型のパラメータに割り当てできない。
    // a('z');
}
