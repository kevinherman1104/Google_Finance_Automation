const wdio = require('webdriverio');
const assert = require("assert");
const opts = {
    capabilities: {
        browserName : 'chrome',
    },

};

async function main(){
    const browser = await wdio.remote(opts);
    let status;
    let element;
    // Given I am on google Finance Web Page
    await browser.url("https://www.google.com/finance");
    
    //Then I can see Dashboard Page Of Google Finance
    status = await browser.$('//*[@id="sdgBod"]').waitForDisplayed();
    assert.equal(status, true);
    
    //Then I click on search bar of Google Finance
    await browser.$("//*[@id='yDmH0d']/c-wiz[2]/div/div[3]/div[3]/div/div/div/div[1]").click();
    
    //Then I type GGR on search bar of google finance
    await browser.keys("GGR");
    await browser.pause(2000);

    //When I see Gudang Garam in Drop Down of Google Finance Search Bar
    status = await browser.$('//div[.="Gudang Garam Tbk PT"]').waitForDisplayed();
    assert.equal(status, true);

    //Then I click on Gudang Garam in Drop Down of Google Finance Search Bar
    await browser.$('//div[.="Gudang Garam Tbk PT"]').click();

    //When I am on Gudang Garam Page
    status = await browser.$('//div[.="Gudang Garam Tbk PT"]').waitForDisplayed();
    assert.equal(status, true);

    //Then I click on Max Tab in Gudang Garam Page
    await browser.$('//*[@id="maxTab"]').click();
    await browser.pause(1500);

    
    // Then I can see graph element of Gudang Garam on Max Tab View
    stat = await (await browser.$('//div[@class="ushogf"]')).waitForDisplayed();
    assert.equal(status, true);

    //When I Collect Data from graph
    const parent = await browser.$('//div[@class="ushogf"]');
    const graph = await browser.$('svg g.Zelcpf');
    const dimensionParent = await browser.getElementRect(parent['element-6066-11e4-a52e-4f735466cecf']);
    const dimensionGraph = await browser.getElementRect(graph['element-6066-11e4-a52e-4f735466cecf']);

    diffParentGraph = Math.ceil(dimensionParent.width - dimensionGraph.width) + 1; //difference between parent and graph

    rearGraphDistance = diffParentGraph * 2 //left and right

    totalGraph_width = dimensionParent.width - rearGraphDistance //total graph width

    graphMidStart = totalGraph_width/2 //middle section of graph (mid->left) or (mid -> right)

    leftPointStart = graphMidStart - totalGraph_width //start from left most

    var pointer = parseInt(leftPointStart)
    array_price = []; //array of price
    var price = 0;
    while (pointer < graphMidStart + 100){
        //start from the left most
        await browser.$('//div[@class="ushogf"]').click({ x: pointer });
        await browser.pause(1500);

        //info: waiting for pop up to be visible
        status = await browser.$('//p[@class="hSGhwc-SeJRAd"]').isDisplayed();
        if (status == false){
            pointer+=1;
        }
        else{
            price = await browser.$('//p[@class="hSGhwc-SeJRAd"]').getText();

            //extract the value from the string
            num_price =  Number(price.replace(/[^0-9.-]+/g,""));
    
            //push to collection of prices
            array_price.push(num_price);
    
            //increment to move the pointer
            pointer += 1;
           

        }
        // assert.equal(status, true);

        //price variable
       


    }
    // max price from collection of price
    max_price = Math.max(...array_price);

    //index of the max price
    max_index = array_price.indexOf(max_price);

    //one period prior to the max price index
    before_index = max_index - 1

    //price of the one period prior to the max price index
    before_max = array_price[before_index];
    
    //diff between max price and period before = ANSWER
    diff = max_price - before_max

    //Then I can see the Difference Price Of Highest substract with one day Prior
    //NOTE: assuming one day prior is one index before the Highest which is not exactly one day but previous period note in graph
    console.log("Answer is:")

    console.log(diff);

    
    



}
main().then(() => console.log("Success!"));
