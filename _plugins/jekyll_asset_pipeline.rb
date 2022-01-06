require 'jekyll_asset_pipeline'
require 'fileutils'
require 'bootstrap'

def copy_files(source, destination)
	puts %(copy_files.rb: Copying files from "#{source}" to "#{destination}")
  FileUtils.mkdir_p(File.dirname(destination))
	FileUtils.cp_r  Dir.glob(source).first, destination
end

Jekyll::Hooks.register :site, :after_init do |jekyll|
	copy_files "#{Bootstrap.gem_path}/assets/javascripts", "assets/js/vendor/bootstrap"
  copy_files "#{Bootstrap.gem_path}/assets/stylesheets", "assets/css/vendor/bootstrap"
end
