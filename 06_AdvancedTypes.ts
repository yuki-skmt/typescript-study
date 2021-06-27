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
