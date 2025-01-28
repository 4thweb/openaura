export default function execute({ args, env, toolName, result }) {
  switch (toolName) {
    case 'readPath':
      result = env.read(args.path);
      break;

    case 'writePath':
      result = env.write(args.path, args.description, args.content);
      break;

    case 'renamePath':
      result = env.rename(args.path, args.newName);
      break;

    case 'movePath':
      result = env.move(args.oldPath, args.newPath);
      break;

    case 'removePath':
      result = env.remove(args.path);
      console.log(result);
      break;

    case 'editFile':
      result = env.edit(args.path, args.updates);
      break;

    default:
      console.warn('Unknown tool called:', toolName);
      return null;
  }
}