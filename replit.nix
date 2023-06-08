{ pkgs }: {
  deps = [
    pkgs.htop
    pkgs.nodePackages.vscode-langservers-extracted
    pkgs.nodePackages.typescript-language-server  
  ];
}