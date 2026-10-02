import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:forui/forui.dart';
import 'package:saju/saju.dart';
import 'package:timezone/data/latest.dart' as tz;
import 'package:timezone/timezone.dart' as tz;

void main() {
  tz.initializeTimeZones();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Saju Example',
      builder: (context, child) =>
          FTheme(data: FTheme.neutral.light.touch, child: child!),
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
        FLocalizations.delegate,
      ],
      supportedLocales: const [Locale('en'), Locale('ko')],
      home: const SajuPage(),
    );
  }
}

class SajuPage extends StatefulWidget {
  const SajuPage({super.key});

  @override
  State<SajuPage> createState() => _SajuPageState();
}

class _SajuPageState extends State<SajuPage> {
  // 2000-01-01 18:00
  final DateTime _selectedDate = DateTime(2000, 1, 1, 18, 0);
  final Gender _gender = Gender.male;
  SajuResult? _result;

  @override
  void initState() {
    super.initState();
    _calculate();
  }

  void _calculate() {
    final location = tz.getLocation('Asia/Seoul');
    final birthDateTime = tz.TZDateTime(
      location,
      _selectedDate.year,
      _selectedDate.month,
      _selectedDate.day,
      _selectedDate.hour,
      _selectedDate.minute,
    );

    setState(() {
      _result = getSaju(birthDateTime, gender: _gender);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Saju Example')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Birth Date: 2000-01-01 18:00 (Fixed for demo)'),
            const SizedBox(height: 20),
            FButton(onPress: _calculate, child: const Text('Calculate')),
            const SizedBox(height: 20),
            if (_result != null) ...[
              _buildPillarsCard(),
              const SizedBox(height: 16),
              _buildInfoCard(),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildPillarsCard() {
    return FCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Four Pillars (사주)',
            style: context.theme.cardStyle.titleTextStyle,
          ),
          const SizedBox(height: 16),
          _buildPillarRow('Year (년주)', _result!.pillars.year),
          const SizedBox(height: 8),
          _buildPillarRow('Month (월주)', _result!.pillars.month),
          const SizedBox(height: 8),
          _buildPillarRow('Day (일주)', _result!.pillars.day),
          const SizedBox(height: 8),
          _buildPillarRow('Time (시주)', _result!.pillars.hour),
        ],
      ),
    );
  }

  Widget _buildPillarRow(String label, Pillar pillar) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label),
        Row(
          children: [
            Text(
              pillar.stem.korean,
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            Text(
              pillar.branch.korean,
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildInfoCard() {
    return FCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Analysis', style: context.theme.cardStyle.titleTextStyle),
          const SizedBox(height: 16),
          Text('Strength (신강약): ${_result!.strength.level.korean}'),
          const SizedBox(height: 8),
          Text('Yongshen (용신): ${_result!.yongShen.primary.korean}'),
        ],
      ),
    );
  }
}
