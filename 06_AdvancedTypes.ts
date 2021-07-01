// 記法の定義
// A <: B … Aが型Bのサブタイプであるか、またはBと同じ型であることを表す。
// A >: B … Aが型Bのスーパータイプであるか、またはBと同じ型であることを表す。

namespace Covariance {
    /*=================================================
     * 共変性(covariance)
     * ・Tそのものか、そのサブタイプを必要とする性質。
     * ・(一部の例外を除き)TypeScriptでは、型は全てそのメンバーに対して共変である。
     *================================================*/

    let deleteUser = (user: { id?: number; name: string }) => {
        delete user.id;
    };

    type LegacyUser = {
        id?: number | string;
        name: string;
    };

    let legacyUser: LegacyUser = {
        id: '793331',
        name: 'Xin Yang',
    };

    // - LegacyUser型の'id'は、string、number、undefinedを取りうる
    // - deleteUserのパラメータ'id'は、number、undefinedを取りうる
    // - LegacyUser型の'id'は、deleteUserのパラメータ'id'のサブタイプでも、同じ型でもないため、割り当て不可。

    // エラー
    // 型 'string | number | undefined' を型 'number | undefined' に割り当てることはできません。
    // 型 'string' を型 'number | undefined' に割り当てることはできません。
    // deleteUser(legacyUser);
}

namespace Contravariance {
    /*=================================================
     * 反変性(contravariance)
     * ・Tそのものか、そのスーパータイプを必要とする性質。
     * ・TypeScriptでは、関数パラメータの型は反変である。
     *
     * ※補足：その他の変性
     *
     * 不変性(invariance)
     * ・Tそのものを必要とする性質。
     *
     * 双変性(bivariance)
     * ・Tそのものか、そのスーパータイプか、そのサブタイプを必要とする性質。
     *================================================*/
    // Animal <: Bird <: Crowの例
    class Animal {}

    class Bird extends Animal {
        chirp() {}
    }

    class Crow extends Bird {
        caw() {}
    }

    let chirp = (bird: Bird): Bird => {
        bird.chirp();
        return bird;
    };

    // - Animalは、chirpのパラメータ'bird'のサブタイプでも、同じ型でもないため、割り当て不可。
    // chirp(new Animal());
    chirp(new Bird());
    chirp(new Crow());

    // 「Birdを取り、Birdを返す関数f」を取る関数clone
    let clone = (f: (b: Bird) => Bird): void => {
        // ...
        let parent = new Bird();
        let baby = f(parent);
        baby.chirp();
    };

    // Birdを取り、Birdを返す関数
    let BirdToBird = (b: Bird): Bird => {
        return new Bird();
    };
    clone(BirdToBird); // 当然OK

    // Birdを取り、Crowを返す関数
    let BirdToCrow = (b: Bird): Crow => {
        return new Crow();
    };
    clone(BirdToCrow); // OK

    // Birdを取り、Animalを返す関数
    let BirdToAnimal = (b: Bird): Animal => {
        return new Animal();
    };
    // clone(BirdToAnimal); // エラー。共変。

    // Animalを取り、Birdを返す関数
    let AnimalToBird = (a: Animal): Bird => {
        return new Bird();
    };
    clone(AnimalToBird); // OK

    // Crowを取り、Birdを返す関数
    let CrowToBird = (c: Crow): Bird => {
        c.caw();
        return new Bird();
    };
    // clone(CrowToBird); // エラー。反変。
}

namespace TypeWidening {
    /*=================================================
     * 型の拡大
     *================================================*/
    const a = 'x'; // 'x'
    let b = a; // stringに拡大して型推論

    // null、undefinedで初期化された場合、anyになる
    let c = null;
    c = 3;
    c = b;

    function x() {
        let a = null;
        a = 3;
        a = 'b';
        return a;
    }
    // スコープを離れると明確な型を割り当てる
    let d = x(); // string
}

namespace ConstAssertion {
    /*=================================================
     * constアサーション
     *================================================*/
    let a = { x: 3 }; // { x: number }
    let b: { x: 3 }; // { x: 3 }
    // constアサーションによって、型の拡大を抑えることができる
    let c = { x: 3 } as const; // { readonly x: 3 }

    // 深くネストされたデータ構造にconstアサーションすると再帰的にreadonlyにできる
    let d = [1, { x: 2 }]; // (number | { x: number })[]
    let e = [1, { x: 2 }] as const; // readonly [1, {readonly x: 2;}]
}

namespace ExcessPropertyChecking {
    /*=================================================
     * 過剰プロパティチェック
     * ・フレッシュ(新鮮)なオブジェクトリテラル型Tを別の型Uに割り当てるとき
     * TypeScriptはエラーを報告する。
     *================================================*/
    /*=================================================
     * フレッシュ(新鮮)なオブジェクトリテラル型とは？
     * ・オブジェクトリテラルからTypeScriptが推論する型。
     * ・型アサーションを使用するか、変数割り当てされれば、「フレッシュ」でなくなる。
     *================================================*/
    type Options = {
        baseURL: string;
        cacheSize?: number;
        tier?: 'prod' | 'dev';
    };

    class API {
        constructor(private options: Options) {}
    }

    new API({
        baseURL: 'https://api.mysite.com',
        // tierr: 'prod', // 誤字。エラー
    });

    /*
    このとき、
    { baseURL: string, cacheSize?: number, tier?: 'prod' | 'dev'}が期待されているところに
    { baseURL: string, tierr: string }を渡した。
    渡された型 <: 期待される型(共変)なのでOKとなるはずだが、TypeScriptはエラーを検知した。
    (過剰プロパティチェック)
    */

    // 例1
    // フレッシュなまま渡しているので過剰プロパティチェックが行われる
    new API({
        baseURL: 'https://api.mysite.com',
        // badTier: 'prod', // エラー
    });

    // 例2
    // 型アサーションによってフレッシュではなくなる
    // =>過剰プロパティチェックを行わない
    new API({
        baseURL: 'https://api.mysite.com',
        badTier: 'prod',
    } as Options);

    // 例3
    let options = {
        baseURL: 'https://api.mysite.com',
        badTier: 'prod',
    };
    // 既に割り当て済み
    // =>過剰プロパティチェックを行わない
    new API(options);

    // 例4
    // フレッシュなまま渡しているので過剰プロパティチェックが行われる
    let options2: Options = {
        baseURL: 'https://api.mysite.com',
        // badTier: 'prod', // エラー
    };
    // 既に割り当て済み
    // =>過剰プロパティチェックを行わない
    new API(options2);
}

namespace TypeRefinement {
    /*=================================================
     * 型の絞り込み
     * ・制御フロー文(if, ?, ||, switch)や型クエリー(typeof, instanceof)
     * 　をもとにコンパイラは型を特定する。
     *================================================*/
    type Unit = 'cm' | 'px' | '%';
    let units: Unit[] = ['cm', 'px', '%'];
    let parseUnit = (value: string) => {
        for (let i = 0; i < units.length; i++) {
            if (value.endsWith(units[i])) {
                return units[i];
            }
        }
        return null;
    };
    type Width = {
        unit: Unit;
        value: number;
    };
    let parseWidth = (
        width: number | string | null | undefined
    ): Width | null => {
        // この時点ではwidthは(number | string | null | undefined)
        if (width == null) {
            // nullもしくはundefinedの場合
            return null;
        }

        // nullとの緩やかな同値チェックをくぐり抜けたということは、
        // 少なくともnullやundefinedではないはず
        // widthは(number | string)になる
        //  => 型の絞り込み！
        if (typeof width === 'number') {
            return { unit: 'px', value: width };
        }

        // typeofの結果がnumberではないということは、
        // widthはstringになる
        //  => 型の絞り込み！
        // この時点ではunitは(Unit | null)
        let unit = parseUnit(width);

        if (unit) {
            // if (unit)がTruthyだったということは、nullではないはず
            // unitはUnitになる
            //  => 型の絞り込み！
            return { unit, value: parseFloat(width) };
        }
        return null;
    };
}
