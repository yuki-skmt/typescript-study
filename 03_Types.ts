namespace AnyType {
    /*=================================================
     *【any型】
     * ・型がわからない場合にデフォルトで割り当てられる型。
     * ・「全て」の値の集合であり、「何でも」行うことができる。
     * 　→型安全性を保証するために極力使用するべきではない。
     *================================================*/
    // エラーにならない
    let a: any = 666;
    let b: any = ['danger'];
    let c = a + b; // !!!
}

namespace UnknownType {
    /*=================================================
     *【unknown型】
     * ・anyと同様に、任意の値を表す。
     * ・型の絞り込みを行うまで、使用が許可されない。
     *================================================*/
    let a: unknown;
    // 絞り込み前なのでエラーになる
    //a + 2;

    let b: unknown = 1;
    if (typeof b === 'number') {
        // 絞り込み後なのでエラーにならない
        b + 2;
    }
}

namespace BooleanType {
    /*=================================================
     *【boolean型】
     * ・true/falseからなる。
     * ・比較ができる。(==, ===, ||, &&, ?)
     * ・否定ができる。(!)
     *================================================*/
    // 推論可能
    let a = true;
    var b = false;
    const c = true;

    // 明示的に示すことができる
    let d: boolean = true;

    // 特定のbooleanであることを示すことができる
    let e: true = true;

    // エラー：特定のboolean型にはそれ以外割当不可
    //let f: true = false;
}

namespace NumberType {
    /*=================================================
     *【number型】
     * ・整数、浮動小数点数、正数、負数、無限大(Infinity)、非数(NaN)などの集まり。
     * ・加算(+)、減算(-)、余剰(%)、比較(<)などができる。
     *================================================*/
    // 推論可能
    let a = 1234;
    var b = Infinity * 0.1;
    const c = 5678;

    // 比較可能(boolean)
    let d = a < b;

    // 明示的に示すことができる
    let e: number = 100;

    // 特定の値であることを示すことができる
    let f: 26.218 = 26.218;

    // エラー：特定のnumber型にはそれ以外割当不可
    //let g: 26.218 = 10;
}

namespace BigintType {
    /*=================================================
     *【bigint型】
     * ・numberの上限(2^53)より大きい値も含めた、正数の集まり。
     * ・加算(+)、減算(-)、乗算(*)、除算(/)、比較(<)などができる。
     *================================================*/
    // 推論可能
    let a = 1234n;
    const b = -5678n;
    var c = a + b;

    // 比較可能(boolean)
    let d = a < 1235;

    // エラー：少数は割当不可
    //let e = 88.5n;

    // 明示的に示すことができる
    let f: bigint = 100n;

    // 特定の値であることを示すことができる
    let g: 100n = 100n;

    // エラー：number型のリテラルは割当不可
    //let h: bigint = 100;
}

namespace StringType {
    /*=================================================
     *【string型】
     * ・全ての文字列の集まり。
     * ・連結(+)、スライス(.slice)などができる。
     *================================================*/
    // 推論可能
    let a = 'hello';
    var b = 'billy';
    const c = '!';
    let d = a + ' ' + b + c;

    // 明示的に示すことができる
    let e: string = 'zoom';

    // 明示的に示すことができる
    let f: 'john' = 'john';

    // エラー：特定のstring型にはそれ以外割当不可。
    //let g: 'john' = 'zoe';
}

namespace SymbolType {
    /*=================================================
     *【symbol型】
     * ・常に一意の値を返す。
     * ・文字列キーの代替となる。
     *
     *【unique symbol型】
     * ・symbol型をconstに割り当てる場合、unique symbolと推論される。
     * ・常にそれ自身と等しくなる。
     * ・常に他のunique symbolと等しくならない。
     *================================================*/
    // 推論可能
    let a = Symbol('a');
    let b: symbol = Symbol('b');

    // 比較可能(常にfalse)
    var c = a === b;

    // エラー：割当不可。
    //let d = a + 'x';

    // unique symbol
    const e = Symbol('e');
    const f: unique symbol = Symbol('f');

    // エラー：const以外では割当不可
    //let g: unique symbol = Symbol('f');

    // 常にtrueを返す
    let h = e === e;

    // エラー：常にfalseを返す
    //let i = e === f;
}

namespace ObjectType {
    /*=================================================
     *【object型】
     * ・オブジェクトの形状を指定できる。
     * ・構造的型付け(not 名前的型付け)される。
     * 　→型付けの上では何のプロパティを持つかが重要で、その名前は重要ではない。
     * ・宣言時、objectで型を明示しない。オブジェクトリテラル表記で型推論させる。
     *================================================*/
    // 悪い例
    let a: object = {
        b: 'x',
    };
    // エラー
    //a.b

    // 良い例：オブジェクトリテラル
    let c = {
        d: 'x',
    };
    // エラーではない
    c.d;

    // constでもletと同様に型推論される(特定の値で型付けされるわけではない)
    // { f: string }
    const e = {
        f: 'x',
    };
}

namespace ShapeOfObject {
    // object型の割り当て
    let a: { b: number };

    // プロパティが不足していたり、余計なプロパティがあるとエラー。
    //a = {}
    //a = {b: 1, c: 2};

    let c: {
        d: number; // number型のプロパティ"d"は必須。
        e?: string; // string型のプロパティ"e"は任意。(undefinedでもOK)
        // index signature
        // キーの型はnumberかstringである必要がある。
        [key: number]: boolean; // boolean型の数値プロパティを任意の数持つことができる。
    };

    c = { d: 1 };
    c = { d: 1, e: undefined };
    c = { d: 1, e: 'd' };
    c = { d: 1, 10: true };
    c = { d: 1, 10: true, 20: false };

    // エラー
    //c = { 10: true };
    //c = { d: 1, 33: 'red' };

    let user: {
        readonly name: string; // 読み取り専用フィールドを指定可能
    };
    user = { name: 'Yuki' };
    // エラー
    //user.name = 'Yuka'
}

namespace TypeAlias {
    type Age = Number;
    type Person = { name: string; age: Age };
    type Color = 'red';
    // エラー。同じ型は重複して宣言不可
    //type Color = 'blue'

    // typeはブロックスコープなので内側のスコープでは宣言可能
    if (true) {
        // 上のColorを覆い隠す
        type Color = 'blue';
    }
}

namespace UnionTypeAndIntersectionType {
    type Cat = { name: string; purrs: boolean };
    type Dog = { name: string; barks: boolean; wags: boolean };

    /*=================================================
     *【合併型】
     * ・複数の型の和を表現できる。
     *================================================*/
    // CatOrDogOrBoth型は、Cat型とDog型の合併型である。
    type CatOrDogOrBoth = Cat | Dog;

    // Cat型のプロパティをもつもの
    let a: CatOrDogOrBoth = {
        name: 'Bonkers',
        purrs: true,
    };

    // Dog型のプロパティをもつもの
    let b: CatOrDogOrBoth = {
        name: 'Domino',
        barks: true,
        wags: true,
    };

    // Cat型とDog型のプロパティをもつもの
    let c: CatOrDogOrBoth = {
        name: 'Donkers',
        purrs: true,
        barks: true,
        wags: true,
    };

    /*=================================================
     *【交差型】
     * ・複数の型が共通で持っているものを表現できる。
     *================================================*/
    // CatAndBoth型は、Cat型とDog型の交差型である。
    type CatAndDog = Cat & Dog;

    // Cat型のプロパティをもつもの
    // Dog型のbarks, wagsが足りないのでエラー。
    // let d: CatAndDog = {
    //     name: 'Bonkers',
    //     purrs: true,
    // };

    // Dog型のプロパティをもつもの
    // Cat型のpurrsが足りないのでエラー。
    // let e: CatAndDog = {
    //     name: 'Domino',
    //     barks: true,
    //     wags: true,
    // };

    // Cat型とDog型のプロパティをもつもの
    let f: CatAndDog = {
        name: 'Donkers',
        purrs: true,
        barks: true,
        wags: true,
    };
}

namespace ArrayType {
    /*=================================================
     *【配列型】
     * ・要素の集合(コレクション)を表す。
     * ・要素の連結、追加、検索、スライスなどの操作をサポートしている。
     *================================================*/
    let a = [1, 2, 3]; // number[]
    var b = ['a', 'b']; // string[]
    let c: string[] = ['a']; // string[](明示的)
    let d = [1, 'a']; // (string | number)[] ※非推奨
    let e = [2, 'b']; // (string | number)[] ※非推奨

    /*=================================================
     * Any型の型付け
     *================================================*/
    function buildArray() {
        let a = []; // Any[]
        a.push(1); // number[]
        a.push('x'); // (number | string)[]
        return a;
    }
    // 宣言が行われたスコープを離れた時点で最終的な型(この場合(number | string)[])が割り当てられる
    let arr = buildArray();

    // エラー
    //arr.push(true);

    // 読み取り専用
    // 明示的な型アノテーションが必要
    let f: readonly string[] = ['a'];
    // エラー。破壊的変更ができない。
    //f.push('a');
}

namespace Tuple {
    /*=================================================
     *【タプル】
     * ・配列のサブタイプ(派生型)
     * ・固定長の配列を型付けするために使用する
     * ・必ず明示的に型付けする必要がある
     *================================================*/
    let a: [string, string, number];
    a = ['a', 'b', 2];
    // エラー
    //a = ['a', 'b'];
    //a = ['a', 'b', 2, 2];

    // 省略可能な要素もサポートしている
    let b: [string, string, number?];
    b = ['a', 'b', 2];
    b = ['a', 'b'];

    // 可変長の要素もサポートしている
    let c: [string, ...string[]] = ['a', 'b', 'c', 'd', 'e'];
    let d: [number, boolean, string, ...string[]] = [
        1,
        true,
        'a',
        'b',
        'c',
    ];

    // 読み取り専用型もサポートしている
    let e: readonly [number, string] = [1, '2'];
    // エラー
    //e.push(6)
}

namespace ArrayType {
    /*=================================================
     *【配列型】
     * ・要素の集合(コレクション)を表す。
     * ・要素の連結、追加、検索、スライスなどの操作をサポートしている。
     *================================================*/
    let a = [1, 2, 3]; // number[]
    var b = ['a', 'b']; // string[]
    let c: string[] = ['a']; // string[](明示的)
    let d = [1, 'a']; // (string | number)[] ※非推奨
    let e = [2, 'b']; // (string | number)[] ※非推奨

    /*=================================================
     * Any型の型付け
     *================================================*/
    function buildArray() {
        let a = []; // Any[]
        a.push(1); // number[]
        a.push('x'); // (number | string)[]
        return a;
    }
    // 宣言が行われたスコープを離れた時点で最終的な型(この場合(number | string)[])が割り当てられる
    let arr = buildArray();

    // エラー
    //arr.push(true);

    // 読み取り専用
    // 明示的な型アノテーションが必要
    let f: readonly string[] = ['a'];
    // エラー。破壊的変更ができない。
    //f.push('a');
}

namespace Lack {
    /*=================================================
     *【あるものの欠如を表す型】
     * ・null: 値の欠如
     * ・undefined: 値がまだ割り当てられていない変数
     * ・void: 戻り値を持たない関数の戻り値
     * ・never: 常に戻ることのない関数の戻り値
     *================================================*/
    // null型はnullという値のみを取りうる
    let a: null = null;

    // undefined型はundefinedという値のみを取りうる
    let b: undefined = undefined;

    // void型の関数
    let c = (): void => {
        1 + 1;
    };

    // never型の関数
    let d = (): never => {
        throw TypeError();
    };
}

namespace Enum {
    enum Language {
        English,
        Spanish,
        Russian,
    }

    // 明示的にも宣言可能
    enum Size {
        Small = 0,
        Midium = 1,
        Large = 2,
    }

    // 分割して宣言可能
    enum Level {
        Low = 0,
        Mid = 1,
    }
    enum Level {
        High,
    }

    // 型安全性上の問題があるので、使用は非推奨
    enum Color {
        Red = 0,
        Blue = 1,
    }
    // 定義外の数値を代入してもエラーにならない
    let a: Color = 2;
}
