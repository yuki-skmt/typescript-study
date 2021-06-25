namespace MyFunction {
    /*=================================================
     * いろいろな関数宣言
     *================================================*/
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

    /*=================================================
     * オプションパラメータ
     *================================================*/
    function log(message: string, userId?: string) {
        console.log(message, userId);
    }
    log('Loaded'); // 呼び出し可能
    log('Loaded', '12345'); // 呼び出し可能

    /*=================================================
     * デフォルトパラメータ
     *================================================*/
    function log2(message: string, userId: string = 'defaultUser') {
        console.log(message, userId);
    }
    log2('Loaded'); // 呼び出し可能
    log2('Loaded', '12345'); // 呼び出し可能

    /*=================================================
     * JavaScriptの可変長引数
     *================================================*/
    // argumentsを使用する。型安全ではない。
    function sumVariadic(): number {
        return Array.from(arguments).reduce((total, n) => total + n, 0);
    }
    // エラー
    // console.log(sumVariadic(1, 2, 3));

    /*=================================================
     * レストパラメータ
     *================================================*/
    // レストパラメータが上記の代替になる。
    function sumVariadicSafe(...numbers: number[]): number {
        return numbers.reduce((total, n) => total + n, 0);
    }
    console.log(sumVariadicSafe(1, 2, 3));

    /*=================================================
     * 関数を呼び出す様々な方法
     *================================================*/
    function add(a: number, b: number) {
        return a + b;
    }
    add(1, 2);
    add.apply(null, [1, 2]);
    add.call(null, 1, 2);
    add.bind(null, 1, 2);

    /*=================================================
     * ジェネレーター
     *================================================*/
    // 一連の値を生成する方法
    // 明示的にアノテートできる
    function* createFibonacciGenerator(): Generator<number> {
        let a = 0;
        let b = 1;
        while (true) {
            yield a;
            [a, b] = [b, a + b];
        }
    }
    let fibonacciGenerator = createFibonacciGenerator();
    console.log(fibonacciGenerator.next().value);
    console.log(fibonacciGenerator.next().value);
    console.log(fibonacciGenerator.next().value);
    console.log(fibonacciGenerator.next().value);
    console.log(fibonacciGenerator.next().value);
    console.log(fibonacciGenerator.next().value);
    console.log(fibonacciGenerator.next().value);
    console.log(fibonacciGenerator.next().value);

    /*=================================================
     * イテレータ
     *================================================*/
    // 一連の値を利用するための方法
    // 独自の反復可能オブジェクトを定義できる
    let numbers = {
        *[Symbol.iterator]() {
            for (let n = 0; n <= 10; n++) {
                yield n;
            }
        },
    };

    // 反復可能
    for (let a of numbers) {
        console.log(a);
    }

    // 反復可能オブジェクトを展開できる
    let allNumbers = [...numbers];

    // 反復可能オブジェクトを分割割り当てできる
    let [one, two, ...rest] = numbers;

    function sum(a: number, b: number): number {
        return a + b;
    }
    console.log(typeof sum); // Function型

    /*=================================================
     * 呼び出しシグネチャ
     *================================================*/
    // 引数と戻り値を定義できる。
    // 値の保持(デフォルトパラメータのような)はできない。
    type Log = (message: string, userId?: string) => void;

    let write: Log = (message, userId = 'Not Signed In') => {
        let time = new Date().toISOString();
        console.log(time, message, userId);
    };

    // 文脈的型付け
    function times(f: (index: number) => void, n: number) {
        for (let i = 0; i < n; i++) {
            f(i);
        }
    }
    // 関数をインラインで宣言すれば、明示的型アノテートは不要になる。
    // = 文脈から推察できる！
    times((n) => console.log(n), 4);

    // エラー。関数をインラインで宣言しなければ、型推論できない。
    // function f(n) {
    //     console.log(n);
    // }
    // times(f, 4);

    /*=================================================
     * オーバーロードされた関数の型
     *================================================*/
    type Reservation = {};
    type Reserve = {
        (from: Date, to: Date, destination: string): Reservation;
        (from: Date, destination: string): Reservation;
    };

    // エラー。
    //let reserve: Reserve = (from, to, destination) => {};

    // 2つのオーバーロードを手動で結合した結果のシグネチャ。
    let reserve: Reserve = (from: Date, toOrDestination: Date | string, destination?: string) => {
        return {};
    };
}
