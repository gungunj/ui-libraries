#!/usr/bin/env node
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import fse from 'fs-extra';
import semver from 'semver';
import { program } from 'commander';
import commands from '../lib/commands/index.js';

const {
  screenshot,
  build,
  deploy,
  overload,
} = commands;

// eslint-disable-next-line no-underscore-dangle
const __dirname = dirname(fileURLToPath(import.meta.url));

function checkNodeVersion(requireNodeVersion, frameworkName = 'lcap-scripts') {
  if (!semver.satisfies(process.version, requireNodeVersion)) {
    console.log();
    console.log(chalk.red(`  You are using Node ${process.version}`));
    console.log(chalk.red(`  ${frameworkName} requires Node ${requireNodeVersion}, please update Node.`));
    console.log();
    console.log();
    process.exit(1);
  }
}

// eslint-disable-next-line wrap-iife
(async () => {
  const packageInfo = await fse.readJSON(path.join(__dirname, '../package.json'));
  checkNodeVersion(packageInfo.engines.node, packageInfo.name);
  program.version(packageInfo.version).usage('<command> [options]');
  const cwd = process.cwd();

  program.command('screenshot')
    .description('批量 block.stories 截图')
    .argument('<folder>', '组件文件夹')
    .option('--port <port>', '设置端口', '6006')
    .action(async (folder, { port }) => {
      await screenshot(cwd, port, folder);
    });

  program.command('build')
    .description('构建流程，vite build 生成 theme.config.json usage.json, nasl.ui.json, i18n.json 等文件')
    .action(async () => {
      await build();
    });

  program.command('deploy')
    .description('发布流程')
    .option('--images', '发布图片')
    .option('--platform <platform>', '发布cdn 地址')
    .option('--username <username>', '发布username')
    .option('--password <password>', '发布password')
    .option('--bucket <bucket>', '发布 bucket')
    .action(async ({ ...args }) => {
      await deploy(cwd, args);
    });

  program.command('overload')
    .description('重载组件')
    .argument('<component>', '组件名称')
    .option('--fork', '是否复制组件源代码')
    .option('--prefix <prefix>', '重载组件名称前缀')
    .action(async (component, options) => {
      await overload(cwd, {
        fork: options.fork,
        prefix: options.prefix,
        component,
      });
    });

  program.parse(process.argv);

  const proc = program.runningCommand;

  if (proc) {
    proc.on('close', process.exit.bind(process));
    proc.on('error', () => {
      process.exit(1);
    });
  }

  const subCmd = program.args[0];
  if (!subCmd) {
    program.help();
  }
})();
