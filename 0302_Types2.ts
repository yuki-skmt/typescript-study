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
    let d: [number, boolean, string, ...string[]] = [1, true, 'a', 'b', 'c'];

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
