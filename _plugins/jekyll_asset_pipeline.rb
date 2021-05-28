require 'jekyll_asset_pipeline'
require 'fileutils'

def copy_files(source, destination)
	puts %(copy_files.rb: Copying files from "#{source}" to "#{destination}")
  FileUtils.mkdir_p(File.dirname(destination))
	FileUtils.cp_r  Dir.glob(source).first, destination
end

Jekyll::Hooks.register :site, :after_init do |jekyll|
	copy_files 'vendor/bundle/ruby/*/gems/bootstrap-5.0.0/assets/javascripts', 'assets/js/vendor/bootstrap'
end
