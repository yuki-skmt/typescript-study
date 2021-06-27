namespace Chess {
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
                file: Math.abs(position.file.charCodeAt(0) - this.file.charCodeAt(0)),
            };
        }
    }

    // 抽象クラス
    abstract class Piece {
        protected position: Position;
        constructor(private readonly color: Color, file: File, rank: Rank) {
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
