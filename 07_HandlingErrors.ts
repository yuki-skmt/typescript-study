namespace ThrowException {
    // カスタムエラー型
    class InvalidDateFormatError extends RangeError {}
    class DateIsInTheFutureError extends RangeError {}

    let parse = (
        birthday: string
    ): Date | InvalidDateFormatError | DateIsInTheFutureError => {
        let date = new Date(birthday);
        if (!isValid(date)) {
            return new InvalidDateFormatError(
                'Enter a date in the form YYYY/MM/DD'
            );
        }
        if (date.getTime() > Date.now()) {
            return new DateIsInTheFutureError('Are you a timelord?');
        }
        return date;
    };

    let isValid = (date: Date) => {
        return false;
    };
}

namespace OptionType {
    // Option
    let parse = (birthday: string): Date[] => {
        let date = new Date(birthday);
        if (!isValid(date)) {
            return [];
        }
        return [date];
    };

    let isValid = (date: Date) => {
        return false;
    };

    function ask() {
        let result = prompt('When is your birthday');
        if (result === null) {
            return [];
        }
        return [result];
    }

    interface Option<T> {
        flatMap<U>(f: (value: T) => None): None;
        flatMap<U>(f: (value: T) => Option<U>): Option<U>;
        getOrElse(value: T): T;
    }

    function Option<T>(value: null | undefined): None;
    function Option<T>(value: T): Some<T>;
    function Option<T>(value: T): Option<T> {
        if (value == null) {
            return new None();
        }
        return new Some(value);
    }

    class Some<T> implements Option<T> {
        constructor(private value: T) {}
        flatMap<U>(f: (value: T) => None): None;
        flatMap<U>(f: (value: T) => Some<U>): Some<U>;
        flatMap<U>(f: (value: T) => Option<U>): Option<U> {
            return f(this.value);
        }
        getOrElse(): T {
            return this.value;
        }
    }

    class None implements Option<never> {
        flatMap(): None {
            return this;
        }
        getOrElse<U>(value: U): U {
            return value;
        }
    }

    let result = Option(6)
        .flatMap((n) => Option(n * 3))
        .flatMap((n) => new None())
        .getOrElse(7);
}
