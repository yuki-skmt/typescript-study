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

namespace Generic {
    /*=================================================
     * ジェネリック型パラメータ(多相型パラメータ)
     * 複数の場所で型レベルの制約を強制するために使われるプレースホルダの型。
     *================================================*/
    /*=================================================
     * 呼び出しシグネチャにTのスコープを持たせる例
     *================================================*/
    type Filter = {
        <T>(array: T[], f: (item: T) => boolean): T[];
    };

    let filter: Filter = (array, f) => {
        let newArray: typeof array = [];
        for (let i of array) {
            if (f(i)) {
                newArray.push(i);
            }
        }
        return newArray;
    };

    // ここでnumberにバインドされる
    let a = filter([1, 2, 3], (_) => _ > 2);

    // ここでstringにバインドされる
    let b = filter(['a', 'b'], (_) => _ != 'b');

    // ここで{ firstName: string }にバインドされる
    let names = [{ firstName: 'beth' }, { firstName: 'caitlyn' }, { firstName: 'xin' }];
    let c = filter(names, (_) => _.firstName.startsWith('b'));

    /*=================================================
     * 型エイリアスにTのスコープを持たせる例
     *================================================*/
    type Filter2<T> = {
        (array: T[], f: (item: T) => boolean): T[];
    };

    // 型アノテートが必要になる
    let numberFilter: Filter2<number> = (array, f) => {
        // 実装省略
        let newArray: typeof array = [];
        for (let i of array) {
            if (f(i)) {
                newArray.push(i);
            }
        }
        return newArray;
    };

    /*=================================================
     * ジェネリック宣言のまとめ
     *================================================*/
    // (1)完全な呼び出しシグネチャ
    // Tのスコープが個々のシグネチャに限られる
    type FilterA = {
        <T>(array: T[], f: (item: T) => boolean): T[];
    };
    // let filter: FilterA = //...

    // (2)完全な呼び出しシグネチャ
    // Tのスコープがシグネチャ全体に及ぶ
    type FilterB<T> = {
        (array: T[], f: (item: T) => boolean): T[];
    };
    // let filter: FilterB<number> = //...

    // (3)省略記法の呼び出しシグネチャ
    // Tのスコープが個々のシグネチャに限られる
    type FilterC = <T>(array: T[], f: (item: T) => boolean) => T[];
    // let filter: FilterC = //...

    // (4)省略記法の呼び出しシグネチャ
    // Tのスコープがシグネチャ全体に及ぶ
    type FilterD<T> = (array: T[], f: (item: T) => boolean) => T[];
    // let filter: FilterD<number> = //...

    // (5)名前付き関数の呼び出しシグネチャ
    // Tのスコープが個々のシグネチャに限られる
    function filterE<T>(array: T[], f: (item: T) => boolean): T[] {
        // ...
        return [];
    }

    /*=================================================
     * ジェネリックの型推論
     *================================================*/
    function mymap<T, U>(array: T[], f: (item: T) => U): U[] {
        let result = [];
        for (let i = 0; i < array.length; i++) {
            result[i] = f(array[i]);
        }
        return result;
    }

    // 暗黙的呼び出し(型推論)
    // => function map<string, boolean>(array: string[], f: (item: string) => boolean): boolean[]
    mymap(['a', 'b', 'c'], (_) => _ === 'a');

    // 明示的呼び出し(型アノテート)
    // => function map<string, boolean>(array: string[], f: (item: string) => boolean): boolean[]
    mymap<string, boolean>(['a', 'b', 'c'], (_) => _ === 'a');

    // 以下のように、明示的に型アノテートしてやる必要がある場合もある。
    // (関数の引数の型だけを使用してジェネリックの型推論を行うので)

    // エラー
    // let promise = new Promise((resolve) => resolve(45));
    // promise.then((result) => result * 4);

    // OK
    let promise = new Promise<number>((resolve) => resolve(45));
    promise.then((result) => result * 4);
}

namespace Polymorphism {
    /*=================================================
     * 制約付きポリモーフィズム：二分木(Binary Tree)のサンプル
     * ノードは以下の2種類存在する。
     * ・子ノードを持たないLeaf node
     * ・少なくとも1つの子ノードを持つInner node
     *================================================*/
    // 基本となるノード
    type TreeNode = {
        value: string;
    };

    // 常にtrueであるisLeafプロパティを持つ
    type LeafNode = TreeNode & {
        isLeaf: true;
    };

    // 子ノードであるTreeNodeを1～2つchildrenプロパティとして持つ
    type InnerNode = TreeNode & {
        children: [TreeNode] | [TreeNode, TreeNode];
    };

    // TをTreeNodeとそのサブタイプに限定している
    function mapNode<T extends TreeNode>(node: T, f: (value: string) => string): T {
        return { ...node, value: f(node.value) };
    }

    /*=================================================
     * 複数の制約付きポリモーフィズム
     *================================================*/
    // 辺を持つことを表現する型
    type HasSides = { numberOfSides: number };

    // 辺が長さを持つことを表現する型
    type SidesHaveLength = { sideLength: number };

    // 長さのある辺を備えていることを表現する
    function logPerimeter<Shape extends HasSides & SidesHaveLength>(s: Shape): Shape {
        console.log(s.numberOfSides * s.sideLength);
        return s;
    }

    type Square = HasSides & SidesHaveLength;
    let square: Square = { numberOfSides: 4, sideLength: 3 };
    logPerimeter(square);

    /*=================================================
     * 可変長引数をモデル化
     *================================================*/
    // 制限付きポリモーフィズムを使って、可変長引数をモデル化できる
    // 何らかの引数のセット(個数不明)であるTを取り、何らかの型Rを返す
    function call<T extends unknown[], R>(f: (...args: T) => R, ...args: T): R {
        return f(...args);
    }

    function fill(length: number, value: string): string[] {
        return Array.from({ length }, () => value);
    }

    call(fill, 10, 'a');

    /*=================================================
     * ジェネリック型のデフォルトの型
     *================================================*/
    // 指定がなかった場合にデフォルト型を使用する
    type MyEvent<T extends HTMLElement = HTMLElement> = {
        target: T;
        type: string;
    };

    // 複数指定する場合はデフォルト型を持たないジェネリック型の後に指定する必要がある
    type MyEvent2<Type extends string, T extends HTMLElement = HTMLElement> = {
        target: T;
        type: Type;
    };

    // エラー
    // type MyEvent3<T extends HTMLElement = HTMLElement, Type extends string> = {
    //     target: T;
    //     type: Type;
    // };
}
