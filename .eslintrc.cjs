module.exports = {
	parser: '@typescript-eslint/parser',
	extends: [
		'airbnb',
		'airbnb/hooks',
		'plugin:@typescript-eslint/recommended',
		'plugin:prettier/recommended',
	],
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module',
		ecmaFeatures: {
			jsx: true,
		},
	},
	rules: {
		'@typescript-eslint/no-unused-vars': ['error'],
		'prettier/prettier': 'error',
		'import/no-extraneous-dependencies': [
			'error',
			{
				devDependencies: true,
				optionalDependencies: false,
				peerDependencies: false,
			},
		],
	},
	settings: {
		react: {
			version: 'detect',
		},
	},
};
