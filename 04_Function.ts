namespace MyFunction {
    // named function
    function greet(name: string) {
        return 'hello' + name;
    }

    // 関数式
    let greet2 = function (name: string) {
        return 'hello' + name;
    };

    // アロー関数式
    let greet3 = (name: string) => {
        return 'hello' + name;
    };

    // アロー関数式の省略記法
    let greet4 = (name: string) => 'hello' + name;

    // 関数コンストラクタ
    // 型安全ではないので非推奨
    let greet5 = new Function('name', 'return "hello" + name');

    // オプションパラメータ
    function log(message: string, userId?: string) {
        console.log(message, userId);
    }
    log('Loaded'); // 呼び出し可能
    log('Loaded', '12345'); // 呼び出し可能

    // デフォルトパラメータ
    function log2(message: string, userId: string = 'defaultUser') {
        console.log(message, userId);
    }
    log('Loaded'); // 呼び出し可能
    log('Loaded', '12345'); // 呼び出し可能

    // JavaScriptの可変長引数
    // argumentsを使用する。型安全ではない。
    function sumVariadic(): number {
        return Array.from(arguments).reduce((total, n) => total + n, 0);
    }
    // エラー
    // console.log(sumVariadic(1, 2, 3));

    // レストパラメータが上記の代替になる。
    function sumVariadicSafe(...numbers: number[]): number {
        return numbers.reduce((total, n) => total + n, 0);
    }
    console.log(sumVariadicSafe(1, 2, 3));

    // 関数を呼び出す様々な方法
    function add(a: number, b: number) {
        return a + b;
    }
    add(1, 2);
    add.apply(null, [1, 2]);
    add.call(null, 1, 2);
    add.bind(null, 1, 2);
}
