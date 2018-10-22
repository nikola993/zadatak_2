class Unit {
    constructor(name) {
        this.name = name;
        this.health = 100;
        this.rechargeTime = (1000 * this.health / 100);
        this.damage = (this.health / 100);
        this.criticalChance = (10 - this.health / 10);
    }

    // Metoda za trazenje mete za napad
    findTarget(units) {
        let target;
        const numberOfUnits = units.length;
        do {
            target = Math.floor(Math.random() * numberOfUnits);
        }
        while (units[target].health < 0);
        return units[target];
    }

    // Metoda za napad
    attack(units) {
        const target = this.findTarget(units);
        const reamningUnits = units.filter(unit => unit.health > 0); // kada jedinica ima manje od 1 health-a izbacuje se iz niza
        if (this.health > 0) {
            target.receiveDamage(this.doDamage());
            console.log(`jedinica[${this.name}] -> jedinica[${target.name}]; jedinica[${target.name}].health = ${target.health}`);
            setTimeout(() => {
                this.attack(units);
            }, this.rechargeTime);
        } else {
            console.log(`jedinica[${this.name}] je mrtva;`);
            if (reamningUnits.length === 1) {
                console.log(`jedinica[${target.name}] je pobedila!!!`);
                process.exit();
            }
        }
    }

    doDamage() {
        return this.damage;
    }

    // Metoda za regulisanje statova posle napada
    receiveDamage(damage) {
        this.health -= this.criticalStrike(damage);
        this.rechargeTime = (1000 * this.health / 100);
        this.damage = (this.health / 100);
        this.criticalChance = (10 - this.health / 10);
    }

    // Metoda za racunanje da li je napad critical strike
    criticalStrike(damage) {
        if (this.criticalChance >= Math.floor(Math.random() * 100)) {
            return damage * 2;
        }
        return damage;
    }
}

// kreiranje jedinica
function makeUnits(numberOfUnit) {
    const units = [];
    for (let i = 0; i < numberOfUnit; i += 1) {
        units.push(new Unit(i));
    }
    return units;
}

function filterUnits(units, me) {
    return units.filter(unit => unit.name !== me);
}

const standardInput = process.stdin;
console.log('Unesite broj jedinica');
standardInput.on('data', (data) => { // Unos broja jedinica
    if (data <= 5 && data > 1 && data !== '\n\n') {
        const units = makeUnits(data);
        units.forEach((unit) => { // pokretanje napada svih jedinica
            const otherUnits = filterUnits(units, unit.name);
            unit.attack(otherUnits);
        });
    } else {
        console.log('Morate uneti broj manji od 6 a veci od 1');
    }
});
