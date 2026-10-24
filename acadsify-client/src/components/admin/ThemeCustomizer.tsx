import React from 'react';
import { Paintbrush, Layout, Type, Palette } from 'lucide-react';
import { cn } from '../../lib/utils';

export function ThemeCustomizer() {
  const { 
    colors,
    typography,
    layout,
    updateColors,
    updateLayout,
    updateTypography,
    resetTheme
  } = useTheme();

  const colorSchemes = [
    { name: 'Default', primary: '#3b82f6', secondary: '#10b981' },
    { name: 'Ocean', primary: '#0ea5e9', secondary: '#0d9488' },
    { name: 'Forest', primary: '#22c55e', secondary: '#84cc16' },
    { name: 'Sunset', primary: '#f97316', secondary: '#ec4899' },
    { name: 'Royal', primary: '#8b5cf6', secondary: '#6366f1' },
  ];

  const layouts = [
    { name: 'Default', sidebar: 'left', header: 'top' },
    { name: 'Minimal', sidebar: 'none', header: 'top' },
    { name: 'Centered', sidebar: 'none', header: 'none' },
    { name: 'Modern', sidebar: 'left', header: 'left' },
  ];

  const fonts = [
    { name: 'System Default', value: '-apple-system, system-ui, sans-serif' },
    { name: 'Inter', value: 'Inter, sans-serif' },
    { name: 'Roboto', value: 'Roboto, sans-serif' },
    { name: 'Poppins', value: 'Poppins, sans-serif' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Theme Customization</h2>
        <button
          onClick={resetTheme}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
        >
          Reset to Default
        </button>
      </div>

      {/* Color Schemes */}
      <div className="space-y-4">
        <h3 className="flex items-center gap-2 text-lg font-semibold">
          <Palette className="w-5 h-5" />
          Color Scheme
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {colorSchemes.map((scheme) => (
            <button
              key={scheme.name}
              onClick={() => updateColors({
                primary: scheme.primary,
                secondary: scheme.secondary,
              })}
              className={cn(
                "p-4 rounded-lg border transition-all",
                colors.primary === scheme.primary
                  ? "border-blue-500 shadow-md"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <div className="flex gap-2 mb-2">
                <div
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: scheme.primary }}
                />
                <div
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: scheme.secondary }}
                />
              </div>
              <span className="text-sm font-medium">{scheme.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Layout Options */}
      <div className="space-y-4">
        <h3 className="flex items-center gap-2 text-lg font-semibold">
          <Layout className="w-5 h-5" />
          Layout
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {layouts.map((layoutOption) => (
            <button
              key={layoutOption.name}
              onClick={() => updateLayout(layoutOption)}
              className={cn(
                "p-4 rounded-lg border transition-all",
                layout === layoutOption.name.toLowerCase()
                  ? "border-blue-500 shadow-md"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <div className="w-full h-24 bg-gray-100 rounded mb-2 relative">
                {layoutOption.sidebar !== 'none' && (
                  <div className="absolute left-0 top-0 bottom-0 w-1/4 bg-gray-200 rounded-l" />
                )}
                {layoutOption.header !== 'none' && (
                  <div className="absolute top-0 right-0 left-0 h-1/4 bg-gray-200 rounded-t" />
                )}
              </div>
              <span className="text-sm font-medium">{layoutOption.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Typography */}
      <div className="space-y-4">
        <h3 className="flex items-center gap-2 text-lg font-semibold">
          <Type className="w-5 h-5" />
          Typography
        </h3>
        <div className="grid gap-4">
          {fonts.map((font) => (
            <button
              key={font.name}
              onClick={() => updateTypography({ fontFamily: font.value })}
              className={cn(
                "p-4 rounded-lg border transition-all text-left",
                typography.fontFamily === font.value
                  ? "border-blue-500 shadow-md"
                  : "border-gray-200 hover:border-gray-300"
              )}
              style={{ fontFamily: font.value }}
            >
              <span className="text-lg">{font.name}</span>
              <p className="mt-1 text-gray-600">
                The quick brown fox jumps over the lazy dog
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="border rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold">Preview</h3>
        <div className="space-y-4">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            style={{ backgroundColor: colors.primary }}
          >
            Primary Button
          </button>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded-lg ml-2"
            style={{ backgroundColor: colors.secondary }}
          >
            Secondary Button
          </button>
          <div className="prose" style={{ fontFamily: typography.fontFamily }}>
            <h4>Sample Heading</h4>
            <p>This is how your content will look with the selected theme.</p>
          </div>
        </div>
      </div>
    </div>
  );
}