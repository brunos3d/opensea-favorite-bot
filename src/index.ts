import * as bip39 from 'bip39';
import puppeteer from 'puppeteer';
import * as dappeteer from '@chainsafe/dappeteer';

const ASSET_OPENSEA_URL = 'https://opensea.io/assets/0x282a7d13152b3f51a3e31d46a2ca563f8554d85d/9255';

async function main() {
  const browser = await dappeteer.launch(puppeteer, {
    metamaskVersion: 'v10.8.1',
    defaultViewport: null,
    args: ['--start-maximized'],
  });

  const seed = bip39.generateMnemonic();

  console.log('mnemonic:', seed);

  const metamask = await dappeteer.setupMetamask(browser, { seed });

  await metamask.page.waitForTimeout(1000);

  const assetPage = await browser.newPage();

  await assetPage.goto(ASSET_OPENSEA_URL);

  let favButton = await assetPage.waitForSelector('.UnstyledButtonreact__UnstyledButton-sc-ty1bh0-0.btgkrL');

  await favButton?.click();

  const loginButton = await assetPage.waitForSelector(
    '.UnstyledButtonreact__UnstyledButton-sc-ty1bh0-0.btgkrL.Blockreact__Block-sc-1xf18x6-0.Flexreact__Flex-sc-1twd32i-0.Itemreact__ItemBase-sc-1idymv7-0.elqhCm.jYqxGr.glymPt'
  );

  await loginButton?.click();

  await metamask.approve();

  await assetPage.bringToFront();

  await assetPage.waitForTimeout(1000);

  const walletButton = await assetPage.waitForSelector('.UnstyledButtonreact__UnstyledButton-sc-ty1bh0-0.btgkrL.NavItem--main.NavItem--withIcon');

  await walletButton?.click();

  favButton = await assetPage.waitForSelector('.UnstyledButtonreact__UnstyledButton-sc-ty1bh0-0.btgkrL');

  await favButton?.click();

  await metamask.sign();

  await browser.close();
}

(async () => {
  while (true) {
    try {
      await main();
    } catch (error) {
      console.log('error:', error);
    }
  }
})();
