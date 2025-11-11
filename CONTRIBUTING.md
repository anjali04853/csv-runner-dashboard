# Contributing to CSV Runner Dashboard

Thank you for your interest in contributing! This document provides guidelines for contributing to this project.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the problem, not the person
- Help create a welcoming environment

## Getting Started

### Prerequisites
- Node.js v18.17.0 or higher
- npm v9.0.0 or higher
- Git
- Code editor (VS Code recommended)

### Setup Development Environment

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/csv-runner-dashboard.git
   cd csv-runner-dashboard
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Running Locally
```bash
npm run dev
```
Access at `http://localhost:3000`

### Building
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

## Coding Standards

### TypeScript
- Use strict type checking
- Define interfaces for all data structures
- Avoid `any` types unless absolutely necessary
- Use meaningful variable names

### React Components
- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use proper prop types

### File Naming
- Components: PascalCase (`CSVUploader.tsx`)
- Utilities: camelCase (`data-validator.ts`)
- Types: PascalCase interfaces in `types/index.ts`

### Code Style
- 2 spaces for indentation
- Single quotes for strings
- Semicolons required
- Trailing commas in multi-line objects/arrays

### Comments
- Use JSDoc for functions
- Explain "why", not "what"
- Keep comments up-to-date

Example:
```typescript
/**
 * Validates CSV headers against expected format
 * @param headers - Array of header strings from CSV
 * @returns Validation result with errors and normalized headers
 */
export function validateHeaders(headers: string[]): ValidationResult {
  // Implementation
}
```

## Pull Request Process

### Before Submitting
1. Ensure code builds without errors
2. Test your changes thoroughly
3. Update documentation if needed
4. Add comments for complex logic
5. Run linter and fix issues

### PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How was this tested?

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code builds successfully
- [ ] Tested locally
- [ ] Documentation updated
- [ ] Lint errors resolved
```

### Review Process
1. Maintainer will review your PR
2. Address any feedback
3. Once approved, PR will be merged

## Feature Requests

### Creating a Feature Request
1. Check if feature already requested
2. Open a new issue
3. Use feature request template
4. Provide clear description and use cases

## Bug Reports

### Creating a Bug Report
1. Check if bug already reported
2. Open a new issue
3. Include:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots if applicable
   - Browser/OS information

### Bug Report Template
```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Screenshots
If applicable

## Environment
- OS: [e.g., Windows 10]
- Browser: [e.g., Chrome 120]
- Node version: [e.g., 18.17.0]
```

## Areas for Contribution

### High Priority
- [ ] Unit tests for validators
- [ ] E2E tests with Playwright
- [ ] Performance optimizations for large datasets
- [ ] Additional chart types
- [ ] Export functionality (PDF, PNG)

### Medium Priority
- [ ] Data filtering and search
- [ ] Date range selection
- [ ] Customizable themes
- [ ] Keyboard shortcuts
- [ ] Localization (i18n)

### Low Priority
- [ ] Comparison between datasets
- [ ] Goal tracking
- [ ] Social sharing
- [ ] Print-friendly views

## Testing Guidelines

### Manual Testing
1. Test with sample CSV
2. Test error scenarios:
   - Invalid headers
   - Invalid dates
   - Invalid numbers
   - Empty file
   - Large file
3. Test on multiple browsers
4. Test responsive design

### Future: Automated Testing
When adding tests, use:
- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: Jest
- **E2E Tests**: Playwright

## Documentation

### What Needs Documentation
- New features
- API changes
- Configuration options
- Deployment steps
- Troubleshooting

### Documentation Style
- Use clear, concise language
- Include code examples
- Add screenshots for UI features
- Keep README.md updated

## Commit Message Guidelines

### Format
```
type(scope): subject

body (optional)

footer (optional)
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

### Examples
```bash
feat(csv): add support for custom date formats

docs: update README with deployment instructions

fix(charts): resolve legend overlap on mobile devices

refactor(validation): extract common validation logic
```

## Code Review Guidelines

### For Reviewers
- Be constructive and respectful
- Explain why changes are needed
- Suggest alternatives
- Approve when satisfied

### For Contributors
- Respond to feedback promptly
- Ask questions if unclear
- Make requested changes
- Thank reviewers

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT License).

## Questions?

Feel free to open an issue for:
- Questions about contributing
- Clarification on requirements
- Technical help

## Thank You!

Your contributions make this project better for everyone. We appreciate your time and effort! 🙌

---

**Last Updated**: November 2025