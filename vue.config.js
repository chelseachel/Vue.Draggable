const config = {
  publicPath: "./",
  configureWebpack: { 
    output: {
      libraryExport: 'default'
    }
  }
}

if (process.env.NODE_ENV === "production") {
  config.configureWebpack.externals = {
    sortableAxis: {
      commonjs: "sortable-axis",
      commonjs2: "sortable-axis",
      amd: "sortable-axis",
      root: "Sortable"
    }
  };
};

module.exports = config;
