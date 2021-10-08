
const YEAR_FROM = 0;
const MONTH_FROM = 1;
const MONTH_TO = 2;
const PROM = 3;
const FREQ = 4;
const PROM_FREQ = 5;
const PROM_XMEDIA = 6;
const PROM_XMEDIA_FREQ = 7;



class Stats {
    constructor() {
        this.quantData = 0;
        this.primitiveList = [];
        this.orderedList = [];
        this.freqTable = [];

        this.quantIntervals = 0;
        this.intervalSize = 0;

        this.sumFreqs = 0;
        this.sumProm_xMediaPerFreq = 0;
        this.xMedia = 0;
        this.type = null;
        this.firstMonth = null;
        this.firstYear = null;

        this.sumatories = [];
        this.m = 0;
        this.b = 0;
    }

    //Media
    mean() {
        let res = 0;
        for (let i = 0; i < this.quantData; i++) {
            res += this.orderedList[i];
        }

        return res / this.quantData;
    }

    //Mode
    mode() {
        let array = this.orderedList;
        let repetidos = [];
        array.forEach(function (numero) {
            repetidos[' ' + String(numero)] = (repetidos[' ' + String(numero)] || 0) + 1;
        });

        let max = 0;
        for (var key in repetidos) {
            if (repetidos[key] > max) {
                max = repetidos[key];
            }
        }
        let modas = []
        for (var key in repetidos) {
            if (repetidos[key] == max) {
                modas.push(parseFloat(key));
            }
        }


        if (modas.length == this.quantData) {
            return 'No existe moda';
        } else {
            return modas.join(' | ');
        }

    }

    //Mediana
    median() {
        if (this.quantData % 2 != 0) {//si la cantidad de datos es impar
            return this.orderedList[parseInt(this.quantData / 2)];
        } else {//si la cantidad de datos es par
            return (this.orderedList[parseInt(this.quantData / 2 - 1)] + this.orderedList[parseInt(this.quantData / 2)]) / 2;
        }
    }

    setIntervalsData(intervalSize) {
        //this.intervals = interval

        switch (intervalSize) {
            case 'Bimensual':
                this.intervalSize = 2;
                break;
            case 'Trimestral':
                this.intervalSize = 3;
                break;
            case 'Semestral':
                this.intervalSize = 6;
                break;
        }

    }

    setFreqTable() {
        let primitiveList = [];
        for (let i = 0; i < this.primitiveList.length; i++) {
            primitiveList[i] = this.primitiveList[i];
        }

        this.quantIntervals = Math.floor(this.primitiveList.length / this.intervalSize);

        if (primitiveList.length % this.intervalSize > 0) {
            this.quantIntervals++;
        }

        let mounthCounter = 0;

        for (let i = 0; i < this.quantIntervals; i++) {
            let sumInterval = 0;
            let countInInterval = 0;
            let initMonth = mounthCounter;
            for (let j = 0; j < this.intervalSize && primitiveList.length > 0; j++) {
                let pivot = primitiveList.shift();
                sumInterval += pivot;
                countInInterval++;
                mounthCounter++;

            }



            this.freqTable[i] = [
                this.getYearByInterval(i),
                months[(initMonth + stats.firstMonth) % 12],
                months[(mounthCounter - 1 + stats.firstMonth) % 12],
                parseFloat(sumInterval) / parseFloat(countInInterval),
                sumInterval
            ];
        }

        this.sumFreqs = 0;
        let sumPromsPerFreq = 0;
        for (let i = 0; i < this.quantIntervals; i++) {
            this.freqTable[i][PROM_FREQ] = this.freqTable[i][PROM] * this.freqTable[i][FREQ];

            this.sumFreqs += this.freqTable[i][FREQ];
            sumPromsPerFreq += this.freqTable[i][PROM_FREQ];
        }

        this.xMedia = parseFloat(sumPromsPerFreq) / parseFloat(this.sumFreqs);

        this.sumProm_xMediaPerFreq = 0;
        for (let i = 0; i < this.quantIntervals; i++) {
            this.freqTable[i][PROM_XMEDIA] = Math.pow(this.freqTable[i][PROM] - this.xMedia, 2);
            this.freqTable[i][PROM_XMEDIA_FREQ] = this.freqTable[i][PROM_XMEDIA] * this.freqTable[i][FREQ];
            this.sumProm_xMediaPerFreq += this.freqTable[i][PROM_XMEDIA_FREQ];
        }
    }

    variance() {
        return this.sumProm_xMediaPerFreq / (this.type == 'sample' ? this.sumFreqs - 1 : this.sumFreqs);
    }

    standardDeviation() {
        return Math.sqrt(this.variance());
    }

    coefficientVariation() {
        return this.standardDeviation() / this.xMedia;
    }

    minSquare() {
        this.sumatories['intervals'] = 0;
        this.sumatories['prom'] = 0;
        this.sumatories['xy'] = 0;
        this.sumatories['x2'] = 0;
        this.sumatories['y2'] = 0;
        for (let i = 0; i < this.freqTable.length; i++) {
            this.sumatories['intervals'] += i;
            this.sumatories['prom'] += this.freqTable[i][PROM];
            this.sumatories['xy'] += i * this.freqTable[i][PROM];
            this.sumatories['x2'] += i * i;
            this.sumatories['y2'] += this.freqTable[i][PROM] * this.freqTable[i][PROM];
        }

        this.m = parseFloat(this.quantIntervals * this.sumatories['xy'] - this.sumatories['intervals'] * this.sumatories['prom']) / parseFloat(this.quantIntervals * this.sumatories['x2'] - this.sumatories['intervals'] * this.sumatories['intervals']);
        this.b = parseFloat(this.sumatories['prom'] * this.sumatories['x2'] - this.sumatories['intervals'] * this.sumatories['xy']) / parseFloat(this.quantIntervals * this.sumatories['x2'] - this.sumatories['intervals'] * this.sumatories['intervals']);

    }

    correlation() {
        return (this.quantIntervals * this.sumatories['xy'] - this.sumatories['intervals'] * this.sumatories['prom']) / (Math.sqrt(this.quantIntervals * this.sumatories['x2'] - this.sumatories['intervals'] * this.sumatories['intervals']) * (Math.sqrt(this.quantIntervals * this.sumatories['y2'] - this.sumatories['prom'] * this.sumatories['prom'])))
    }

    forecast() {
        return [
            this.firstYear + parseInt((this.firstMonth + this.quantIntervals * this.intervalSize) / 12),
            months[(this.firstMonth + this.quantIntervals * this.intervalSize) % 12],
            months[(this.firstMonth + this.intervalSize - 1 + this.quantIntervals * this.intervalSize) % 12],
            this.funcX(this.quantIntervals)
        ];
    }

    funcX(x) {
        return this.m * x + this.b
    }

    printTable() {
        let html = '';

        for (let i = 0; i < this.freqTable.length; i++) {
            html += '<tr>';
            //for (let j = 0; j < this.freqTable[i].length; j++) {
            html += '<td>' + this.freqTable[i][YEAR_FROM] + ' ' + this.freqTable[i][MONTH_FROM] + ' - ' + this.freqTable[i][MONTH_TO] + '</td>';
            html += '<td>' + this.freqTable[i][PROM] + '</td>';
            html += '<td>' + this.freqTable[i][FREQ] + '</td>';
            // }
            html += '</tr>';
        }
        return html;
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

    getYearByMonth(month) {
        return parseInt(this.firstYear + (month + this.firstMonth) / 12);
    }

    getYearByInterval(interval) {
        return parseInt(this.firstYear + parseInt((interval * this.intervalSize + this.firstMonth) / 12));
    }
}

function inQuantData() {
    if ($('#quantDataTxt').val() == '') {
        alert("Ingrese la cantidad de meses a analizar");
    } else if ($('#intervalTxt').val() == 'Semestral' && (parseInt($('#quantDataTxt').val()) % 6 > 0 || parseInt($('#quantDataTxt').val())<12)) {
        alert("Para un intervalo semestral un número multiplo de 6 mayor a 12.");
    } else if ($('#intervalTxt').val() == 'Trimestral' && (parseInt($('#quantDataTxt').val()) % 3 > 0 || parseInt($('#quantDataTxt').val())<6)) {
        alert("Para un intervalo trimestral un número multiplo de 3 mayor a 6.");
    } else if ($('#intervalTxt').val() == 'Bimestral' && (parseInt($('#quantDataTxt').val()) % 2 > 0 || parseInt($('#quantDataTxt').val())<4)) {
        alert("Para un intervalo bimestral un número multiplo de 2 mayor a 4.");
    } else {
        stats.quantData = parseInt($('#quantDataTxt').val());
        stats.firstMonth = parseInt($('#firstMonthTxt').val());
        stats.firstYear = parseInt($('#yearTxt').val());
        generateList();
        $('#quantDataTxt').attr("readonly", true);
        $('#intervalTxt').attr("disabled", true);
        $('#firstMonthTxt').attr("disabled", true);
        $('#yearTxt').attr("disabled", true);
        $('#typeDiv').show();
        $('#resBtn').show();
        $('#inBtn').attr("disabled", true);
        $('#resCol').show();
    }
}

function generateList() {

    //alert("generando lista", stats.quantData);
    html = '';
    for (let i = 0; i < stats.quantData; i++) {
        html +=
            '<div class="form-group col-md-4">' +
            '<label for="list_' + i + '">' + months[(i + stats.firstMonth) % 12] + ' - ' + stats.getYearByMonth(i) + '</label>' +
            '<input type="number" name="list_' + i + '" id="list_' + i + '" class="form-control form-control-sm" value="" autocomplete="off">' +
            '</div>';
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
            valid = false;
        }
    }

    if ($('input:radio[name=typeTxt]:checked').val() == undefined) {
        alert('Seleccione el tipo de varianza');
    } else if (!valid) {
        alert('Por favor complete todos los campos');
    } else {
        stats.primitiveList = [];
        stats.orderedList = [];
        for (let i = 0; i < stats.quantData; i++) {
            stats.primitiveList.push(parseFloat($('#list_' + i).val()));
            stats.orderedList.push(parseFloat($('#list_' + i).val()));
        }
        printLineChartDiv();
        stats.orderedList = stats.bubbleSort(stats.orderedList);
        stats.setIntervalsData($('#intervalTxt').val());
        stats.type = $('#typeTxt').val();
        stats.setFreqTable();
        $('#freqTable').html(stats.printTable());
        printColChartDiv();
        stats.minSquare();
        printScatterChartDiv();
        let forecastData = stats.forecast();


        $('#nextMonthString').html(forecastData[0] + " " + forecastData[1] + " - " + forecastData[2] + " = " + forecastData[3]);

        $('#correlationString').html(stats.correlation() + ' = ' + (stats.correlation() * 100).toFixed(3) + '%');
        $('#listString').html(stats.primitiveList.join(' | '));
        $('#orderListString').html(stats.orderedList.join(' | '));
        $('#mediaString').html(stats.mean());
        $('#modaString').html(stats.mode());
        $('#medianaString').html(stats.median());
        $('#sumFreqsString').html(stats.sumFreqs);
        $('#xMediaString').html(stats.xMedia);
        $('#varianzaString').html(stats.variance());
        $('#desviacionString').html(stats.standardDeviation());
        $('#cvarString').html(stats.coefficientVariation() + ' = ' + (stats.coefficientVariation() * 100).toFixed(3) + '%');
        
        $('#mbString').html('m = '+stats.m+'<br> b = '+stats.b.toFixed(3));
        $('#eqString').html('f(x) = '+stats.m.toFixed(3)+' x + '+stats.b.toFixed(3));
        $('#myTab a[href="#mids"]').tab('show');
    }
}

function printLineChartDiv() {
    am4core.ready(function () {

        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        // Create chart instance
        var chart = am4core.create("lineChartDiv", am4charts.XYChart);

        // Add data
        chart.data = [];
        for (let i = 0; i < stats.primitiveList.length; i++) {
            let mo = ((i + stats.firstMonth) % 12) + 1;
            mo = mo < 10 ? '0' + mo : mo;
            chart.data.push({
                "date": (stats.getYearByMonth(i) + '-' + mo),
                "value": stats.primitiveList[i]
            });
        }

        // Set input format for the dates
        chart.dateFormatter.inputDateFormat = "yyyy-MM-dd";

        // Create axes
        var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

        // Create series
        var series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = "value";
        series.dataFields.dateX = "date";
        series.tooltipText = "{value}"
        series.strokeWidth = 2;
        series.minBulletDistance = 15;

        // Drop-shaped tooltips
        series.tooltip.background.cornerRadius = 20;
        series.tooltip.background.strokeOpacity = 0;
        series.tooltip.pointerOrientation = "vertical";
        series.tooltip.label.minWidth = 40;
        series.tooltip.label.minHeight = 40;
        series.tooltip.label.textAlign = "middle";
        series.tooltip.label.textValign = "middle";

        // Make bullets grow on hover
        var bullet = series.bullets.push(new am4charts.CircleBullet());
        bullet.circle.strokeWidth = 2;
        bullet.circle.radius = 4;
        bullet.circle.fill = am4core.color("#fff");

        var bullethover = bullet.states.create("hover");
        bullethover.properties.scale = 1.3;

        // Make a panning cursor
        chart.cursor = new am4charts.XYCursor();
        chart.cursor.behavior = "panXY";
        chart.cursor.xAxis = dateAxis;
        chart.cursor.snapToSeries = series;

        // Create vertical scrollbar and place it before the value axis
        chart.scrollbarY = new am4core.Scrollbar();
        chart.scrollbarY.parent = chart.leftAxesContainer;
        chart.scrollbarY.toBack();

        // Create a horizontal scrollbar with previe and place it underneath the date axis
        chart.scrollbarX = new am4charts.XYChartScrollbar();
        chart.scrollbarX.series.push(series);
        chart.scrollbarX.parent = chart.bottomAxesContainer;

        //dateAxis.start = 0.79;
        dateAxis.keepSelection = true;
    }); // end am4core.ready()
}

function printColChartDiv() {
    am4core.ready(function () {
        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        // Create chart instance
        var chart = am4core.create("colChartDiv", am4charts.XYChart);
        chart.scrollbarX = new am4core.Scrollbar();

        // Add data
        chart.data = [];
        for (let i = 0; i < stats.freqTable.length; i++) {
            chart.data.push({
                "interval": stats.freqTable[i][YEAR_FROM] + " " + stats.freqTable[i][MONTH_FROM] + " - " + stats.freqTable[i][MONTH_TO],
                "freq": stats.freqTable[i][FREQ]
            });
        }

        // Create axes
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "interval";
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 30;
        categoryAxis.renderer.labels.template.horizontalCenter = "right";
        categoryAxis.renderer.labels.template.verticalCenter = "middle";
        categoryAxis.renderer.labels.template.rotation = 270;
        categoryAxis.tooltip.disabled = true;
        categoryAxis.renderer.minHeight = 110;

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.minWidth = 50;

        // Create series
        var series = chart.series.push(new am4charts.ColumnSeries());
        series.sequencedInterpolation = true;
        series.dataFields.valueY = "freq";
        series.dataFields.categoryX = "interval";
        series.tooltipText = "[{categoryX}: bold]{valueY}[/]";
        series.columns.template.strokeWidth = 0;

        series.tooltip.pointerOrientation = "vertical";

        series.columns.template.column.cornerRadiusTopLeft = 10;
        series.columns.template.column.cornerRadiusTopRight = 10;
        series.columns.template.column.fillOpacity = 0.8;

        // on hover, make corner radiuses bigger
        var hoverState = series.columns.template.column.states.create("hover");
        hoverState.properties.cornerRadiusTopLeft = 0;
        hoverState.properties.cornerRadiusTopRight = 0;
        hoverState.properties.fillOpacity = 1;

        series.columns.template.adapter.add("fill", function (fill, target) {
            return chart.colors.getIndex(target.dataItem.index);
        });

        // Cursor
        chart.cursor = new am4charts.XYCursor();

    }); // end am4core.ready()
}

function printScatterChartDiv() {
    am4core.ready(function () {
        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        // Create chart instance
        var chart = am4core.create("scatterChartDiv", am4charts.XYChart);

        // Add data
        chart.data = [];
        for (let i = 0; i < stats.freqTable.length; i++) {
            chart.data.push({
                "ax": i,
                "ay": stats.freqTable[i][PROM],
            });
        }

        // Create axes
        var valueAxisX = chart.xAxes.push(new am4charts.ValueAxis());
        valueAxisX.title.text = 'Intervalo';
        valueAxisX.renderer.minGridDistance = 40;

        // Create value axis
        var valueAxisY = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxisY.title.text = 'Valor de la variable';

        // Create series
        var lineSeries = chart.series.push(new am4charts.LineSeries());
        lineSeries.dataFields.valueY = "ay";
        lineSeries.dataFields.valueX = "ax";
        lineSeries.strokeOpacity = 0;

        // Add a bullet
        var bullet = lineSeries.bullets.push(new am4charts.Bullet());

        // Add a triangle to act as an arrow
        var arrow = bullet.createChild(am4core.Triangle);
        arrow.horizontalCenter = "middle";
        arrow.verticalCenter = "middle";
        arrow.strokeWidth = 0;
        arrow.fill = chart.colors.getIndex(0);
        arrow.direction = "bottom";
        arrow.width = 12;
        arrow.height = 12;

        //add the trendlines
        var trend = chart.series.push(new am4charts.LineSeries());
        trend.dataFields.valueY = "value2";
        trend.dataFields.valueX = "value";
        trend.strokeWidth = 2
        trend.stroke = chart.colors.getIndex(0);
        trend.strokeOpacity = 0.7;
        trend.data = [
            { "value": 0, "value2": stats.funcX(0) },
            { "value": stats.freqTable.length + 2, "value2": stats.funcX(stats.freqTable.length + 2) },
            //{ "value":  8, "value2": stats.funcX(8) }
        ];

        //scrollbars
        chart.scrollbarX = new am4core.Scrollbar();
        chart.scrollbarY = new am4core.Scrollbar();

    }); // end am4core.ready()
}

let months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
let stats = new Stats();
$('#resBtn').hide();
$('#resCol').hide();
$('#typeDiv').hide();



















