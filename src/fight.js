class Units {
    constructor() {
        this.name = 0;
        this.health = 100;
        this.rechargeTime = (1000 * this.health / 100);
        this.damage = (this.health / 100);
        this.criticalChance = (10 - this.health / 10);
    }

    // Metoda za trazenje mete za napad
    findTarget(units) {
        let target;
        const numberOfUnits = units.length;
        const reamningUnits = units.filter(unit => unit.health > 1); // kada jedinica ima manje od 1 health-a izbacuje se iz niza
        if (reamningUnits.length >= 2) { // dok postoje vise od 2 jedinice trazi metu
            do {
                target = Math.floor(Math.random() * numberOfUnits);
            }
            while (target === this.name || units[target].health <= 1);
            return target;
        }
        if (this.health > 1) { // provera koja od zadnje dve jedinice ima vise od 1 health
            console.log(`jedinica[${this.name}] je pobedila!!!!`);
            process.exit();
        }
        return -1;
    }

    // Metoda za napad
    async attack(units) {
        const target = this.findTarget(units);
        if (target !== -1 && this.health > 1) {
            await this.doDamage(units, target);
            console.log(`jedinica[${this.name}] -> jedinica[${target}]; jedinica[${target}].health = ${units[target].health}`);
            if (units[target].health < 1) {
                console.log(`jedinica[${units[target].name}] je mrtva;`);
            }
            await this.readyToAttack(units); // poziv metode za odbrojavanje do sledeceg napada
        }
    }

    // Metoda za regulisanje statova posle napada
    doDamage(units, target) {
        units[target].health -= this.criticalStrike();
        units[target].rechargeTime = (1000 * this.health / 100);
        units[target].damage = (this.health / 100);
        units[target].criticalChance = (10 - this.health / 10);
    }

    // Metoda za racunanje da li je napad critical strike
    criticalStrike() {
        if (this.criticalChance >= Math.floor(Math.random() * 100)) {
            return this.damage * 2;
        }
        return this.damage;
    }

    // Metoda za racunanje vremena do sledeceg napada
    readyToAttack(units) {
        return new Promise(() => {
            setTimeout(() => {
                this.attack(units);
            }, this.rechargeTime);
        });
    }
}

// kreiranje jedinica
function makeUnits(numberOfUnit) {
    const unit = new Array(numberOfUnit);
    for (let i = 0; i < numberOfUnit; i += 1) {
        unit[i] = new Units();
        unit[i].name = i;
    }
    return unit;
}

const standardInput = process.stdin;
console.log('Unesite broj jedinica');
standardInput.on('data', (data) => { // Unos broja jedinica
    if (data <= 5 && data > 1 && data !== '\n\n') {
        const units = makeUnits(data);
        units.forEach((unit) => { // pokretanje napada svih jedinica
            unit.attack(units);
        });
    } else {
        console.log('Morate uneti broj manji od 6 a veci od 1');
    }
});
