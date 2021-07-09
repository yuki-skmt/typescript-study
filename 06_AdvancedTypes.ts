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

namespace TaggedUnionType {
    /*=================================================
     * タグ付き合併型
     * ・TypeScriptに合併型の型を推論させるために、タグつきの型を使用すること。
     * 　以下の条件を満たすことを推奨する。
     * 　1. 合併型のそれぞれのケースにおいて同じ場所に存在すること。
     * 　2. リテラル型として片付けされていること。
     * 　3. ジェネリックでないこと。
     * 　4. 互いに排他的であること。
     *================================================*/
    type UserTextEvent = {
        type: 'TextEvent';
        value: string;
        target: HTMLInputElement;
    };
    type UserMouseEvent = {
        type: 'MouseEvent';
        value: [number, number];
        target: HTMLElement;
    };
    type UserEvent = UserTextEvent | UserMouseEvent;

    // typeof で型判定した場合
    let hundle1 = (event: UserEvent) => {
        if (typeof event.value === 'string') {
            event.value; // string
            // event.targetの型を絞り込めない
            event.target; // HTMLInputElement | HTMLElement(!!!)
            return;
        }
        event.value; // [number, number]
        // event.targetの型を絞り込めない
        event.target; // HTMLInputElement | HTMLElement(!!!)
    };

    // タグ付き合併型を使用した例
    let hundle2 = (event: UserEvent) => {
        if (event.type === 'TextEvent') {
            event.value; // string
            // event.targetの型まで絞り込める
            event.target; // HTMLInputElement
            return;
        }
        event.value; // [number, number]
        // event.targetの型まで絞り込める
        event.target; // HTMLElement
    };
}

namespace Totality {
    /*=================================================
     * 完全性
     *================================================*/
    type WeekDay = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';
    type Day = WeekDay | 'Sat' | 'Sun';

    // エラー。全てのケースが網羅されていない
    // let getNextDay = (w: WeekDay): Day => {
    //     switch (w) {
    //         case 'Mon':
    //             return 'Tue';
    //     }
    // };

    // エラー。全てのケースが網羅されていない
    // let isBig = (n: number): boolean => {
    //     if (n >= 100) {
    //         return true;
    //     }
    // };
}

namespace LookupType {
    /*=================================================
     * ルックアップ型
     *================================================*/
    type APIResponse = {
        user: {
            userId: string;
            friendList: {
                count: number;
                friends: {
                    firstName: string;
                    lastName: string;
                }[];
            };
        };
    };
    // キーを指定することで型を取得できる
    type FriendList = APIResponse['user']['friendList'];
}

namespace Keyof {
    /*=================================================
     * keyof演算子
     *================================================*/
    type APIResponse = {
        user: {
            userId: string;
            friendList: {
                count: number;
                friends: {
                    firstName: string;
                    lastName: string;
                }[];
            };
        };
    };
    // オブジェクトのキーを文字列リテラル型の合併として取得できる。
    type ResponseKeys = keyof APIResponse; // 'user'
    type UserKeys = keyof APIResponse['user']; // 'userId' | 'friendList'
    type FriendListKeys = keyof APIResponse['user']['friendList']; // 'count' | 'friend'
}

namespace TypeSafeGetter {
    /*=================================================
     * 型安全なgetter
     * ・Lookup型とkeyofを組み合わせると、型安全なgetterを実装できる
     *================================================*/
    type Get = {
        <O extends object, K1 extends keyof O>(o: O, k1: K1): O[K1];
        <
            O extends object,
            K1 extends keyof O,
            K2 extends keyof O[K1]
        >(
            o: O,
            k1: K1,
            k2: K2
        ): O[K1][K2];
        <
            O extends object,
            K1 extends keyof O,
            K2 extends keyof O[K1],
            K3 extends keyof O[K1][K2]
        >(
            o: O,
            k1: K1,
            k2: K2,
            k3: K3
        ): O[K1][K2][K3];
    };

    let get: Get = (object: any, ...keys: string[]) => {
        let result = object;
        keys.forEach((k) => (result = result[k]));
        return result;
    };

    type ActivityLog = {
        lastEvent: Date;
        events: {
            id: string;
            timestamp: Date;
            type: 'Read' | 'Write';
        }[];
    };

    let now = new Date(2020, 3, 8);
    let activityLog: ActivityLog = {
        lastEvent: now,
        events: [{ id: '0001', timestamp: now, type: 'Read' }],
    };
    let lastEvent = get(activityLog, 'lastEvent');
}

namespace RecordType {
    /*=================================================
     * レコード型
     * ・通常のインデックスシグネチャではキーにできるのはstring, numberのみ
     * ・Record型ではstring, numberのサブタイプもキーに使用できる
     *================================================*/
    type WeekDay = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';
    type Day = WeekDay | 'Sat' | 'Sun';

    // エラー。全てのケースが網羅されていない
    // let nextDay: Record<WeekDay, Day> = {
    //     Mon: 'Tue',
    // };
}

namespace MappedType {
    /*=================================================
     * マップ型
     * ・静的型付けのための機能
     * ・ルックアップ型と組み合わせると多彩な制約を表現できる
     *================================================*/
    type WeekDay = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';
    type Day = WeekDay | 'Sat' | 'Sun';

    // エラー。全てのケースが網羅されていない
    // let nextDay: { [K in WeekDay]: Day } = {
    //     Mon: 'Tue',
    // };

    // 色々な使い方
    type Account = {
        id: number;
        isEmployee: boolean;
        notes: string[];
    };

    // 全てのフィールドを省略可能にする
    type OptionalAccount = {
        [K in keyof Account]?: Account[K];
    };

    // 全てのフィールドをnull許容にする
    type NullableAccount = {
        [K in keyof Account]: Account[K] | null;
    };

    // 全てのフィールドを読み取り専用にする
    type ReadonlyAccount = {
        readonly [K in keyof Account]: Account[K];
    };

    // 全てのフィールドを再び書き込み可能にする
    type Account2 = {
        -readonly [K in keyof ReadonlyAccount]: Account[K];
    };

    // 全てのフィールドを再び必須にする
    type Account3 = {
        [K in keyof OptionalAccount]-?: Account[K];
    };

    // 組み込みのマップ型省略
}

namespace CompanionObjectPattern {
    /*=================================================
     * コンパニオンオブジェクトパターン
     * ・型と値の名前空間に同名の(結びつけられた)型を宣言する
     * ・型と値の情報をグループ化するのに役立つ
     * ・一度にインポートできる
     *================================================*/
    type Unit = 'EUR' | 'GBP' | 'JPY' | 'USD';
    type Currency = {
        unit: Unit;
        value: number;
    };

    let Currency = {
        from(value: number, unit: Unit): Currency {
            return {
                unit: unit,
                value,
            };
        },
    };

    // これだけで型・値の両方インポートできる
    // import { Currency } from './Currency'

    // Currencyを型として使用できる
    let amountDue: Currency = {
        unit: 'JPY',
        value: 83733.1,
    };

    // Currencyを値として使用できる
    let otherAmountDue = Currency.from(330, 'EUR');
}

namespace TupleTypeInference {
    /*=================================================
     * タプルについての型推論の改善
     *================================================*/
    // 配列の型推論
    let a = [1, true]; // (number | boolean)[]

    // より厳密な型付けを求めたい場合
    // 型アサーションを使う。
    let b = [1, true] as [number, boolean]; // [number, boolean]

    // 型アサーションを使いたくない場合。
    // レストパラメータを使う
    function tuple<T extends unknown[]>(...ts: T): T {
        return ts;
    }
    let c = tuple(1, true); // [number, boolean]
}

namespace UserDefinedTypeGuard {
    /*=================================================
     * ユーザー定義型ガード
     *================================================*/
    // 型ガードを自分で宣言する場合の記法
    // スコープを離れても型の絞り込みを継続できる。
    let isString = (a: unknown): a is string => {
        return typeof a === 'string';
    };
    isString('a'); // true
    isString(9); // false

    let parseInput = (input: string | number) => {
        let formattedInput: string;
        if (isString(input)) {
            // 型ガードをしない場合、ここでエラー
            formattedInput = input.toUpperCase();
        }
    };
}

namespace ConditionalType {
    /*=================================================
     * 条件型
     * ・型付けを分岐できる。
     *================================================*/
    type IsString<T> = T extends string ? true : false;

    // 分配条件型
    // 分岐全体に合併型を分配できる。
    type ToArray<T> = T extends unknown ? T[] : T[];
    type A = ToArray<number>; // number[]
    type B = ToArray<number | string>; // number[] | string[]

    // inferキーワード
    // 使わない例
    type ElementType<T> = T extends unknown[] ? T[number] : T;
    type C = ElementType<number[]>; // number

    // 使う例
    type ElementType2<T> = T extends (infer U)[] ? U : T;
    type D = ElementType2<number[]>; // number

    // 組み込みの条件型
    // 1. Exclude<T, U>
    // Tには含まれているがUに含まれていない型を算出
    type E = number | string;
    type F = string;
    type G = Exclude<E, F>; // number

    // 2. Extract<T, U>
    // Tに含まれている型のうちUに割り当て可能な型を算出
    type H = number | string;
    type I = string;
    type J = Extract<E, F>; // string

    // 3. NonNullable<T>
    // Tからnullとundefinedを除外した型を算出
    type K = { a?: number | null };
    type L = NonNullable<K['a']>; // number

    // 4. ReturnType<F>
    // 関数の戻り値を算出
    type M = (a: number) => string;
    type N = ReturnType<M>; // string

    // 5. InstanceType<C>
    // クラスコンストラクタのインスタンス型を算出
    type O = { new (): P };
    type P = { a: number };
    type Q = InstanceType<O>; // { a: number }
}

namespace EscapeHatch {
    /*=================================================
     * 完璧に型付けする余裕がないときの様々な次善策。
     * ・あくまで次善策なので、多様せざるを得ない状況になった場合設計を見直すべき。
     *================================================*/
    // 型アサーション
    // ある型がその型のサブタイプもしくはスーパータイプであることを明示できる。
    let formatInput = (input: string) => {
        //
    };

    let getUserInput = (): string | number => {
        return '';
    };

    let input = getUserInput();

    // 型アサーション
    formatInput(input as string);
    formatInput(<string>input); // 非推奨

    // 非nullアサーション
    // ある型がnullやundefinedでないことを明示できる。
    type Dialog = {
        id?: string;
    };

    let closeDialog = (dialog: Dialog) => {
        if (!dialog.id) {
            return;
        }
        setTimeout(() => {
            removeFromDOM(
                dialog,
                // 非nullアサーション
                document.getElementById(dialog.id!)!
            );
        });
    };

    let removeFromDOM = (dialog: Dialog, element: Element) => {
        element.parentNode!.removeChild(element);
        delete dialog.id;
    };

    // 明確な割り当てアサーション
    let userId1: string;
    let userId2!: string;

    // エラー
    // userId1.toUpperCase();

    // 割り当てアサーションをしているのでOK。
    userId2.toUpperCase();
}
