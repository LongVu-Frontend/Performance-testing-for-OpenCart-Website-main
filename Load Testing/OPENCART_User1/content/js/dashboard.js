/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9836956521739131, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=common/home&language=en-gb-26"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=common/home&language=en-gb-27"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=common/home&language=en-gb-28"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=information/information&language=en-gb&information_id=1"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=common/home&language=en-gb-22"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=account/login&language=en-gb"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=common/home&language=en-gb-23"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=common/home&language=en-gb-24"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=checkout/cart&language=en-gb"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=common/home&language=en-gb-25"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=product/product&language=en-gb&product_id=40"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=information/information&language=en-gb&information_id=1-11"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=information/information&language=en-gb&information_id=1-10"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=product/product&language=en-gb&product_id=40-0"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=checkout/cart&language=en-gb-9"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=product/product&language=en-gb&product_id=40-1"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=checkout/cart&language=en-gb-8"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=common/home&language=en-gb-20"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=product/product&language=en-gb&product_id=40-2"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=checkout/cart&language=en-gb-7"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=common/home&language=en-gb-21"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=product/product&language=en-gb&product_id=40-3"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=checkout/cart&language=en-gb-6"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=common/home&language=en-gb-15"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=common/home&language=en-gb-16"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=common/home&language=en-gb-17"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=common/home&language=en-gb-18"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=common/home&language=en-gb-11"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=common/home&language=en-gb-12"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=common/home&language=en-gb-13"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=common/home&language=en-gb-14"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=account/login&language=en-gb-11"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=common/home&language=en-gb-19"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=account/login&language=en-gb-10"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=account/login&language=en-gb-9"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=account/login&language=en-gb-8"], "isController": false}, {"data": [0.5, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=common/home&language=en-gb"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=account/login&language=en-gb-5"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=account/login&language=en-gb-4"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=account/login&language=en-gb-7"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=account/login&language=en-gb-6"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=common/home&language=en-gb-10"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=account/login&language=en-gb-1"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=account/login&language=en-gb-0"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=account/login&language=en-gb-3"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=account/login&language=en-gb-2"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=information/information&language=en-gb&information_id=1-3"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=information/information&language=en-gb&information_id=1-2"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=information/information&language=en-gb&information_id=1-1"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=information/information&language=en-gb&information_id=1-0"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=product/product&language=en-gb&product_id=40-20"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=checkout/cart&language=en-gb-11"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=checkout/cart&language=en-gb-10"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=information/information&language=en-gb&information_id=1-9"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=information/information&language=en-gb&information_id=1-8"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=information/information&language=en-gb&information_id=1-7"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=information/information&language=en-gb&information_id=1-6"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=information/information&language=en-gb&information_id=1-5"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=information/information&language=en-gb&information_id=1-4"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=product/product&language=en-gb&product_id=40-8"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=checkout/cart&language=en-gb-1"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=product/product&language=en-gb&product_id=40-9"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=checkout/cart&language=en-gb-0"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=product/product&language=en-gb&product_id=40-4"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=checkout/cart&language=en-gb-5"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=product/product&language=en-gb&product_id=40-5"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=checkout/cart&language=en-gb-4"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=product/product&language=en-gb&product_id=40-6"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=checkout/cart&language=en-gb-3"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=product/product&language=en-gb&product_id=40-7"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=checkout/cart&language=en-gb-2"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=common/home&language=en-gb-7"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=product/product&language=en-gb&product_id=40-18"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=common/home&language=en-gb-6"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=product/product&language=en-gb&product_id=40-17"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=common/home&language=en-gb-5"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=product/product&language=en-gb&product_id=40-16"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=common/home&language=en-gb-4"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=product/product&language=en-gb&product_id=40-15"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=common/home&language=en-gb-3"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=common/home&language=en-gb-2"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=common/home&language=en-gb-1"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=common/home&language=en-gb-0"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=product/product&language=en-gb&product_id=40-19"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=product/product&language=en-gb&product_id=40-10"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=product/product&language=en-gb&product_id=40-14"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=product/product&language=en-gb&product_id=40-13"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=common/home&language=en-gb-9"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=product/product&language=en-gb&product_id=40-12"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=common/home&language=en-gb-8"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost/opencart-4.0.2.3/upload/index.php?route=product/product&language=en-gb&product_id=40-11"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 91, 0, 0.0, 46.80219780219779, 1, 822, 3.0, 193.0, 266.1999999999996, 822.0, 42.944785276073624, 1484.0376504247286, 52.94084031382727], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=common/home&language=en-gb-26", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 5347.330729166667, 205.40364583333334], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=common/home&language=en-gb-27", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 2318.84765625, 307.6171875], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=common/home&language=en-gb-28", 1, 0, 0.0, 87.0, 87, 87, 87.0, 87.0, 87.0, 87.0, 11.494252873563218, 909.0562140804599, 7.094109195402299], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=information/information&language=en-gb&information_id=1", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 93.64720394736842, 33.46406882591093], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=common/home&language=en-gb-22", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 1350.9114583333333, 204.1015625], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=account/login&language=en-gb", 1, 0, 0.0, 194.0, 194, 194, 194.0, 194.0, 194.0, 194.0, 5.154639175257732, 139.21049452319588, 42.47040109536082], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=common/home&language=en-gb-23", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 3184.5703125, 203.45052083333334], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=common/home&language=en-gb-24", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 1569.82421875, 153.564453125], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=checkout/cart&language=en-gb", 1, 0, 0.0, 202.0, 202, 202, 202.0, 202.0, 202.0, 202.0, 4.9504950495049505, 115.17152691831683, 40.78840501237624], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=common/home&language=en-gb-25", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 1513.671875, 305.6640625], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=product/product&language=en-gb&product_id=40", 1, 0, 0.0, 417.0, 417, 417, 417.0, 417.0, 417.0, 417.0, 2.398081534772182, 286.5824527877698, 32.87760416666667], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=information/information&language=en-gb&information_id=1-11", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 89.19270833333333, 234.375], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=information/information&language=en-gb&information_id=1-10", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 266.6015625, 673.828125], "isController": false}, {"data": ["Test", 1, 0, 0.0, 1882.0, 1882, 1882, 1882.0, 1882.0, 1882.0, 1882.0, 0.5313496280552603, 835.4611533607864, 29.803836510361318], "isController": true}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=product/product&language=en-gb&product_id=40-0", 1, 0, 0.0, 295.0, 295, 295, 295.0, 295.0, 295.0, 295.0, 3.389830508474576, 118.75331038135594, 2.0921610169491527], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=checkout/cart&language=en-gb-9", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 88.8671875, 225.26041666666666], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=product/product&language=en-gb&product_id=40-1", 1, 0, 0.0, 5.0, 5, 5, 5.0, 5.0, 5.0, 5.0, 200.0, 53.515625, 138.671875], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=checkout/cart&language=en-gb-8", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 133.30078125, 353.515625], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=common/home&language=en-gb-20", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 3574.8697916666665, 205.078125], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=product/product&language=en-gb&product_id=40-2", 1, 0, 0.0, 5.0, 5, 5, 5.0, 5.0, 5.0, 5.0, 200.0, 53.515625, 136.1328125], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=checkout/cart&language=en-gb-7", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 89.19270833333333, 235.67708333333331], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=common/home&language=en-gb-21", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 3922.36328125, 154.296875], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=product/product&language=en-gb&product_id=40-3", 1, 0, 0.0, 5.0, 5, 5, 5.0, 5.0, 5.0, 5.0, 200.0, 53.515625, 140.0390625], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=checkout/cart&language=en-gb-6", 1, 0, 0.0, 8.0, 8, 8, 8.0, 8.0, 8.0, 8.0, 125.0, 33.447265625, 89.35546875], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=common/home&language=en-gb-15", 1, 0, 0.0, 63.0, 63, 63, 63.0, 63.0, 63.0, 63.0, 15.873015873015872, 116.11793154761905, 9.672619047619047], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=common/home&language=en-gb-16", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 3198.2421875, 202.79947916666666], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=common/home&language=en-gb-17", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 4420.8984375, 204.42708333333334], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=common/home&language=en-gb-18", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 1221.6796875, 152.83203125], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=common/home&language=en-gb-11", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 8588.134765625, 152.587890625], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=common/home&language=en-gb-12", 1, 0, 0.0, 5.0, 5, 5, 5.0, 5.0, 5.0, 5.0, 200.0, 27082.421875, 122.65625], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=common/home&language=en-gb-13", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 1392.08984375, 150.87890625], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=common/home&language=en-gb-14", 1, 0, 0.0, 6.0, 6, 6, 6.0, 6.0, 6.0, 6.0, 166.66666666666666, 1444.9869791666667, 100.42317708333333], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=account/login&language=en-gb-11", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 133.7890625, 351.5625], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=common/home&language=en-gb-19", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 1402.9947916666667, 204.42708333333334], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=account/login&language=en-gb-10", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 133.30078125, 336.9140625], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=account/login&language=en-gb-9", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 133.30078125, 337.890625], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=account/login&language=en-gb-8", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 133.30078125, 353.515625], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=common/home&language=en-gb", 1, 0, 0.0, 822.0, 822, 822, 822.0, 822.0, 822.0, 822.0, 1.2165450121654502, 1678.139493993309, 21.45586222627737], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=account/login&language=en-gb-5", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 133.30078125, 350.5859375], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=account/login&language=en-gb-4", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 88.8671875, 226.88802083333334], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=account/login&language=en-gb-7", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 133.7890625, 353.515625], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=account/login&language=en-gb-6", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 89.19270833333333, 238.28125], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=common/home&language=en-gb-10", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 2717.7734375, 294.43359375], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=account/login&language=en-gb-1", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 89.19270833333333, 231.11979166666666], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=account/login&language=en-gb-0", 1, 0, 0.0, 186.0, 186, 186, 186.0, 186.0, 186.0, 186.0, 5.376344086021506, 129.3997815860215, 3.234206989247312], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=account/login&language=en-gb-3", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 89.19270833333333, 233.3984375], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=account/login&language=en-gb-2", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 89.19270833333333, 226.88802083333334], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=information/information&language=en-gb&information_id=1-3", 1, 0, 0.0, 5.0, 5, 5, 5.0, 5.0, 5.0, 5.0, 200.0, 53.515625, 140.0390625], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=information/information&language=en-gb&information_id=1-2", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 133.7890625, 340.33203125], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=information/information&language=en-gb&information_id=1-1", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 133.7890625, 346.6796875], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=information/information&language=en-gb&information_id=1-0", 1, 0, 0.0, 238.0, 238, 238, 238.0, 238.0, 238.0, 238.0, 4.201680672268908, 84.84194459033614, 2.638360031512605], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=product/product&language=en-gb&product_id=40-20", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 133.7890625, 351.5625], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=checkout/cart&language=en-gb-11", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 133.7890625, 351.5625], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=checkout/cart&language=en-gb-10", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 133.30078125, 336.9140625], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=information/information&language=en-gb&information_id=1-9", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 133.30078125, 337.890625], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=information/information&language=en-gb&information_id=1-8", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 88.8671875, 235.67708333333331], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=information/information&language=en-gb&information_id=1-7", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 267.578125, 707.03125], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=information/information&language=en-gb&information_id=1-6", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 89.19270833333333, 238.28125], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=information/information&language=en-gb&information_id=1-5", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 133.30078125, 350.5859375], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=information/information&language=en-gb&information_id=1-4", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 133.30078125, 340.33203125], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=product/product&language=en-gb&product_id=40-8", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 66.650390625, 176.7578125], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=checkout/cart&language=en-gb-1", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 133.7890625, 346.6796875], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=product/product&language=en-gb&product_id=40-9", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 133.30078125, 337.890625], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=checkout/cart&language=en-gb-0", 1, 0, 0.0, 189.0, 189, 189, 189.0, 189.0, 189.0, 189.0, 5.291005291005291, 107.54588293650794, 3.1828703703703702], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=product/product&language=en-gb&product_id=40-4", 1, 0, 0.0, 6.0, 6, 6, 6.0, 6.0, 6.0, 6.0, 166.66666666666666, 44.43359375, 113.44401041666667], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=checkout/cart&language=en-gb-5", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 133.30078125, 350.5859375], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=product/product&language=en-gb&product_id=40-5", 1, 0, 0.0, 5.0, 5, 5, 5.0, 5.0, 5.0, 5.0, 200.0, 53.3203125, 140.234375], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=checkout/cart&language=en-gb-4", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 133.30078125, 340.33203125], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=product/product&language=en-gb&product_id=40-6", 1, 0, 0.0, 5.0, 5, 5, 5.0, 5.0, 5.0, 5.0, 200.0, 53.515625, 142.96875], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=checkout/cart&language=en-gb-3", 1, 0, 0.0, 7.0, 7, 7, 7.0, 7.0, 7.0, 7.0, 142.85714285714286, 38.22544642857143, 100.02790178571428], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=product/product&language=en-gb&product_id=40-7", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 133.7890625, 353.515625], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=checkout/cart&language=en-gb-2", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 89.19270833333333, 226.88802083333334], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=common/home&language=en-gb-7", 1, 0, 0.0, 53.0, 53, 53, 53.0, 53.0, 53.0, 53.0, 18.867924528301884, 1226.5625, 11.71875], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=product/product&language=en-gb&product_id=40-18", 1, 0, 0.0, 6.0, 6, 6, 6.0, 6.0, 6.0, 6.0, 166.66666666666666, 353.515625, 100.09765625], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=common/home&language=en-gb-6", 1, 0, 0.0, 239.0, 239, 239, 239.0, 239.0, 239.0, 239.0, 4.184100418410042, 1509.7737970711298, 2.6314069037656904], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=product/product&language=en-gb&product_id=40-17", 1, 0, 0.0, 5.0, 5, 5, 5.0, 5.0, 5.0, 5.0, 200.0, 567.578125, 120.1171875], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=common/home&language=en-gb-5", 1, 0, 0.0, 90.0, 90, 90, 90.0, 90.0, 90.0, 90.0, 11.11111111111111, 582.0529513888889, 6.846788194444445], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=product/product&language=en-gb&product_id=40-16", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 634.27734375, 150.146484375], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=common/home&language=en-gb-4", 1, 0, 0.0, 25.0, 25, 25, 25.0, 25.0, 25.0, 25.0, 40.0, 521.8359375, 23.828125], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=product/product&language=en-gb&product_id=40-15", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 985.3515625, 200.1953125], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=common/home&language=en-gb-3", 1, 0, 0.0, 31.0, 31, 31, 31.0, 31.0, 31.0, 31.0, 32.25806451612903, 3229.9017137096776, 19.814768145161292], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=common/home&language=en-gb-2", 1, 0, 0.0, 34.0, 34, 34, 34.0, 34.0, 34.0, 34.0, 29.41176470588235, 7778.061810661764, 17.491957720588236], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=common/home&language=en-gb-1", 1, 0, 0.0, 107.0, 107, 107, 107.0, 107.0, 107.0, 107.0, 9.345794392523365, 801.7943195093458, 5.6768399532710285], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=common/home&language=en-gb-0", 1, 0, 0.0, 328.0, 328, 328, 328.0, 328.0, 328.0, 328.0, 3.048780487804878, 103.63174066310975, 1.6524152057926829], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=product/product&language=en-gb&product_id=40-19", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 2511.23046875, 152.34375], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=product/product&language=en-gb&product_id=40-10", 1, 0, 0.0, 17.0, 17, 17, 17.0, 17.0, 17.0, 17.0, 58.8235294117647, 417.04963235294116, 36.190257352941174], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=product/product&language=en-gb&product_id=40-14", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 857.7473958333334, 200.1953125], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=product/product&language=en-gb&product_id=40-13", 1, 0, 0.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 9.0, 111.1111111111111, 3480.2517361111113, 66.94878472222223], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=common/home&language=en-gb-9", 1, 0, 0.0, 53.0, 53, 53, 53.0, 53.0, 53.0, 53.0, 18.867924528301884, 343.5657429245283, 11.147553066037736], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=product/product&language=en-gb&product_id=40-12", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 266.6015625, 673.828125], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=common/home&language=en-gb-8", 1, 0, 0.0, 14.0, 14, 14, 14.0, 14.0, 14.0, 14.0, 71.42857142857143, 555.8035714285714, 44.43359375], "isController": false}, {"data": ["http://localhost/opencart-4.0.2.3/upload/index.php?route=product/product&language=en-gb&product_id=40-11", 1, 0, 0.0, 105.0, 105, 105, 105.0, 105.0, 105.0, 105.0, 9.523809523809526, 190.96912202380952, 5.9523809523809526], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 91, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
