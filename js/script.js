class Stats {
    constructor() {
        this.quantData = 0;
        this.listData = [];
    }

    moda() {
        let array = this.listData;
        let repetidos = [];
        array.forEach(function (numero) {
            repetidos[' ' + String(numero)] = (repetidos[' ' + String(numero)] || 0) + 1;
        });

        let max = 0;
        let value = '';
        for (var key in repetidos) {
            if (repetidos[key] > max) {
                max = repetidos[key];
                value = key;
            }
        }
        let modas = []
        for (var key in repetidos) {
            if (repetidos[key] == max) {
                modas.push(parseFloat(key));
            }
        }

        if(modas.length ==  this.quantData) {
            return 'No existe moda';
        }else{
            return modas.join(',');
        }

    }

    media() {
        let res = 0;
        for (let i = 0; i < this.quantData; i++) {
            res += this.listData[i];
        }

        return res / this.quantData;
    }

    mediana() {
        console.log(this.quantData, 'mod', 2, this.quantData % 2);
        if (this.quantData % 2 != 0) {//si la cantidad de datos es impar
            return this.listData[parseInt(this.quantData / 2)];
        } else {//si la cantidad de datos es par
            return (this.listData[parseInt(this.quantData / 2 - 1)] + this.listData[parseInt(this.quantData / 2)]) / 2;
        }
    }

    varianza() {

    }

    factorVariacion() {

    }








    bubbleSort(list) {

        let n = list.length;
        let temp = 0;
        for (let i = 0; i < n - 1; i++) {
            for (let j = i + 1; j < n; j++) {
                if (list[i] > list[j]) {
                    temp = list[i];
                    list[i] = list[j];
                    list[j] = temp;
                }
            }
        }

        return list;
    }
}

function inQuantData() {
    $('#quantDataTxt').val();

    if ($('#quantDataTxt').val() > 0) {
        stats.quantData = parseInt($('#quantDataTxt').val());
        generateList();
    } else {
        alert("ingrese un entero mayor a 0");
    }
}

function generateList() {
    //alert("generando lista", stats.quantData);
    html = "<p class='mt-4'>Ingrese los datos</p>";
    for (let i = 0; i < stats.quantData; i++) {
        html += '<div class="form-group">' +
            '<input type="number" name="list_' + i + '" id="list_' + i + '" class="form-control" value="" autocomplete="off">' +
            '</div>'
    }

    $('#listFields').html(html);

    $('#mediaString').html('');
    $('#modaString').html('');
    $('#medianaString').html('');
}

function saveData() {
    let valid = true;
    for (let i = 0; i < stats.quantData; i++) {
        if ($('#list_' + i).val() == '') {
            valid == false
        }
    }

    if (!valid) {
        alert('Por favor complete todos los campos');
    } else {
        stats.listData = [];
        for (let i = 0; i < stats.quantData; i++) {
            stats.listData.push(parseFloat($('#list_' + i).val()));
        }
        stats.listData = stats.bubbleSort(stats.listData);

        $('#mediaString').html(stats.media());
        $('#modaString').html(stats.moda());
        $('#medianaString').html(stats.mediana());
    }
}


let stats = new Stats();