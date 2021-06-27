namespace Chess {
    /*=================================================
     * クラス
     *================================================*/
    class Game {
        private pieces = Game.makePieces();
        private static makePieces() {
            return [
                // キング
                new King('White', 'E', 1),
                new King('Black', 'E', 8),

                // クイーン
                new Queen('White', 'D', 1),
                new Queen('Black', 'D', 8),

                // ビショップ
                new Bishop('White', 'C', 1),
                new Bishop('White', 'F', 1),
                new Bishop('White', 'C', 8),
                new Bishop('White', 'F', 8),

                // ......
            ];
        }
    }

    // 色、ファイル(横軸)、ランク(縦軸)の型定義
    // 取りうる値が少ないものはリテラルを列挙する
    type Color = 'Black' | 'White';
    type File = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H';
    type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

    class Position {
        constructor(private file: File, private rank: Rank) {}
        distanceFrom(position: Position) {
            return {
                rank: Math.abs(position.rank - this.rank),
                file: Math.abs(
                    position.file.charCodeAt(0) -
                        this.file.charCodeAt(0)
                ),
            };
        }
    }

    // 抽象クラス
    abstract class Piece {
        protected position: Position;
        constructor(
            private readonly color: Color,
            file: File,
            rank: Rank
        ) {
            this.position = new Position(file, rank);
        }
        // デフォルトの実装
        moveTo(position: Position) {
            this.position = position;
        }
        // 派生クラスに実装を強制できる
        abstract canMoveTo(position: Position): boolean;
    }

    class King extends Piece {
        canMoveTo(position: Position): boolean {
            let distance = this.position.distanceFrom(position);
            return distance.rank < 2 && distance.file < 2;
        }
    }
    class Queen extends Piece {
        canMoveTo(position: Position): boolean {
            // 省略
            return true;
        }
    }
    class Bishop extends Piece {
        canMoveTo(position: Position): boolean {
            // 省略
            return true;
        }
    }
    class Knight extends Piece {
        canMoveTo(position: Position): boolean {
            // 省略
            return true;
        }
    }
    class Rook extends Piece {
        canMoveTo(position: Position): boolean {
            // 省略
            return true;
        }
    }
    class Pawn extends Piece {
        canMoveTo(position: Position): boolean {
            // 省略
            return true;
        }
    }
}

namespace MySet {
    /*=================================================
     * 戻り値の型アノテーションとしてのthis
     *================================================*/
    class Set {
        values: number[] = [];
        has(value: number): boolean {
            for (let i of this.values) {
                if (i === value) {
                    return true;
                }
            }
            return false;
        }
        // 戻り値の型アノテーションとしてthisを使用できる。
        add(value: number): this {
            this.values.push(value);
            return this;
        }
    }
    let set = new Set();
    set.add(1);
    let a = set.has(1);
    let b = set.has(2);

    // thisをアノテートすることでaddをオーバーライドする必要がなくなる
    class SubSet extends Set {}
}

namespace Interface {
    /*=================================================
     * 型エイリアスを用いた例
     *================================================*/
    type Food = {
        calories: number;
        tasty: boolean;
    };
    type Sushi = Food & {
        salty: boolean;
    };
    type Cake = Food & {
        sweet: boolean;
    };

    /*=================================================
     * インターフェースを用いた例
     *================================================*/
    interface IFood {
        calories: number;
        tasty: boolean;
    }
    interface ISushi extends IFood {
        salty: boolean;
    }
    interface ICake extends IFood {
        sweet: boolean;
    }

    /*=================================================
     * 型エイリアスとインターフェースの違い
     *================================================*/
    // (1) 型エイリアスの方が任意に型指定できるので汎用的
    // これはインターフェースでは表現不可
    type A = number;
    type B = A | string;

    // (2) 割り当て可能性のチェック有無
    interface C {
        good(x: number): string;
        bad(x: number): string;
    }

    // インターフェースの場合、拡張時に割り当て可能性をチェックするので下記はエラーとなる。
    // 型 '(x: string) => string' を型 '(x: number) => string' に割り当てることはできません。
    // interface D extends C {
    //     good(x: string | number): string;
    //     bad(x: string): string;
    // }

    type C2 = {
        good(x: number): string;
        bad(x: number): string;
    };

    // 型エイリアス(交差型)の場合、拡張元と拡張先を結合し、コンパイルエラーを回避する。
    type D2 = C2 & {
        good(x: string | number): string;
        bad(x: string): string;
    };

    // (3) 同名シンボルが存在する場合の自動マージの有無
    // マージされる
    interface E {
        good(x: number): string;
    }
    interface E {
        bad(x: number): string;
    }

    // エラー。識別子 'F' が重複しています。
    // type F = {
    //     good(x: number): string;
    // };
    // type F = {
    //     bad(x: number): string;
    // };
}

namespace StructuralTyping {
    /*=================================================
     * 構造的型付け
     *================================================*/
    class Zebra {
        trot() {}
    }
    class Poodle {
        trot() {}
    }
    let ambleAround = (animal: Zebra) => {
        animal.trot();
    };

    let zebra = new Zebra();
    let poodle = new Poodle();
    ambleAround(zebra);
    // TypeScriptにおいては名前ではなく構造にもとづいて型付けされる。
    // Zebra型を引数に取る関数に、Zebra型と同じ構造のPoodle型を渡せる。
    ambleAround(poodle);
}

namespace ValuesAndTypes {
    /*=================================================
     * 文脈に基づく語句の解決
     *================================================*/
    // 値と型で名前空間が分けられている
    // 値
    let a = 999;
    function b() {}

    // 型
    type a = number;
    interface b {
        (): void;
    }

    // 文脈から値と推論
    if (a + 1 > 3) {
    }

    // 文脈から型と推論
    let x: a = 3;

    // クラス、列挙型は両方の名前空間を使用する。
    class C {}
    // 前者のCは「クラスのインスタンス型」、後者のCは値を表す。
    let c: C = new C();

    enum E {
        F,
        G,
    }
    // 前者のCは「列挙型Eの型」、後者のEは値を表す。
    let e: E = E.F;

    /*=================================================
     * コンストラクタシグネチャ
     *================================================*/
    type State = {
        [ket: string]: string;
    };

    class StringDatabase {
        state: State = {};
        get(key: string): string | null {
            return key in this.state ? this.state[key] : null;
        }
        set(key: string, value: string): void {
            this.state[key] = value;
        }
        static from(state: State) {
            let db = new StringDatabase();
            for (let key in state) {
                db.set(key, state[key]);
            }
            return db;
        }
    }

    // これによって以下の2つの型が生成される。
    interface StringDatabase {
        state: State;
        get(key: string): string | null;
        set(key: string, value: string): void;
    }

    interface StringDatabaseConstructor {
        // コンストラクタシグネチャ
        // 特定の型でインスタンス化できることを示す記法
        new (): StringDatabase;
        from(state: State): StringDatabase;
    }
}

namespace MixIn {
    /*=================================================
     * ミックスイン(多重継承)のシミュレート
     *================================================*/
    type ClassConstructor<T> = new (...args: any[]) => T;
    function withEzDebug<
        C extends ClassConstructor<{ getDebugValue(): object }>
    >(Class: C) {
        return class extends Class {
            debug() {
                let Name = this.constructor.name;
                let value = this.getDebugValue();
                return Name + '(' + JSON.stringify(value) + ')';
            }
        };
    }

    class HardToDebugUser {
        constructor(
            private id: number,
            private firstName: string,
            private lastName: string
        ) {}
        getDebugValue() {
            return {
                id: this.id,
                name: this.firstName + ' ' + this.lastName,
            };
        }
    }

    let User = withEzDebug(HardToDebugUser);
    let user = new User(3, 'Emma', 'Gluzman');
    console.log(user.debug());
}

// デコレータ省略

namespace Final {
    /*=================================================
     * final(継承の禁止)のシミュレート
     *================================================*/
    class MessageQueue {
        private constructor(private messages: string[]) {}

        // プライベートコンストラクタは、継承だけでなく直接のインスタンス化をも禁止してしまうので、
        // 別途インスタンス化の方法を提供する必要がある。
        static create(messages: string[]) {
            return new MessageQueue(messages);
        }
    }

    // エラー。継承できない。
    // class BadQueue extends MessageQueue {}

    // エラー。直接インスタンス化できない。
    // let queue = new MessageQueue([]);

    // 独自定義のメソッドでインスタンス化する
    let queue = MessageQueue.create([]);
}

namespace FactoryPattern {
    /*=================================================
     * デザインパターン：ファクトリーパターン
     *================================================*/
    type Shoe = {
        purpose: string;
    };

    class BalletFlat implements Shoe {
        purpose = 'dancing';
    }

    class Boot implements Shoe {
        purpose = 'woodcutting';
    }

    class Sneaker implements Shoe {
        purpose = 'walking';
    }

    let Shoe = {
        // 合併型を使うことで、.createを型安全に保つ。
        create(type: 'balletFlat' | 'boot' | 'sneaker'): Shoe {
            // 合併型をswitch分岐すると全ての型を網羅しているかをチェックできる。(型安全)
            switch (type) {
                case 'balletFlat':
                    return new BalletFlat();
                case 'boot':
                    return new Boot();
                case 'sneaker':
                    return new Sneaker();
            }
        },
    };
    let shoe = Shoe.create('boot');
}
namespace BuilderPattern {
    /*=================================================
     * デザインパターン：ビルダーパターン
     * オブジェクトの構築とそのオブジェクトを実際に実装する方法を分離する
     *================================================*/
    class RequestBuilder {
        private data: object | null = null;
        private method: 'get' | 'post' | null = null;
        private url: string | null = null;

        setData(data: object | null): this {
            this.data = data;
            return this;
        }

        setMethod(method: 'get' | 'post'): this {
            this.method = method;
            return this;
        }

        setURL(url: string): this {
            this.url = url;
            return this;
        }

        send() {
            console.log('send!');
        }
    }

    new RequestBuilder()
        .setURL('/users')
        .setMethod('get')
        .setData({ firstName: 'Anna' })
        .send();
}
